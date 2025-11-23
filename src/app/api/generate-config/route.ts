import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { validateBusinessDataForGibberish } from "@/lib/utils/gibberish-detection";

export const runtime = "nodejs";

/* ---------------------------------------------
   Validation Schema
--------------------------------------------- */
const OnboardingSchema = z.object({
  botId: z.string().min(1),
  bot_type: z
    .enum(["Business", "Personal Project"])
    .optional()
    .default("Business"),
  business_name: z.string().min(1),
  business_type: z.string().min(1),
  business_description: z.string(),
  product_name: z.string().min(1),
  product_description: z.string(),
  target_audience: z.string(),
  problem: z.string(),
  brand_voice: z.string(),
});

/* ---------------------------------------------
   Route Handler
--------------------------------------------- */
export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await req.json();
    const parsed = OnboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const {
      bot_type = "Business",
      business_name,
      business_type,
      business_description,
      product_name,
      product_description,
      target_audience,
      problem,
      brand_voice,
    } = parsed.data;

    const isPersonalProject = bot_type === "Personal Project";

    // 2. Pre-check for gibberish before processing
    const gibberishError = validateBusinessDataForGibberish({
      business_name,
      business_type,
      business_description,
      product_name,
      product_description,
      target_audience,
      problem,
      brand_voice,
    });

    if (gibberishError) {
      return NextResponse.json(
        {
          error: "NO_UNDERSTANDING",
          message: gibberishError,
        },
        { status: 400 }
      );
    }

    // 3. Build comprehensive prompt for Gemini to extract maximum context
    const prompt = `You are an expert AI chatbot configuration specialist with deep expertise in creating highly personalized, context-aware chatbot configurations. Your task is to analyze the provided business information and generate an extremely detailed, precise, and comprehensive chatbot configuration that captures every nuance of the business's needs, goals, and customer interaction requirements.

**CRITICAL INSTRUCTIONS:**
- Extract MAXIMUM context from every detail provided
- Reject placeholder or gibberish input. If any required field looks like nonsense (e.g., "asdf", repeated letters, lorem ipsum, keyboard mashing, the same word repeated across multiple fields, or values that clearly do not describe a real business), you MUST return the NO_UNDERSTANDING error described later instead of generating configs.
- Create configurations that are deeply personalized and specific to this exact business
- Consider the relationships between all provided information
- Think about real-world customer interactions and needs
- Generate configurations that reflect the brand voice, target audience, and business goals precisely

**BUSINESS INFORMATION (Analyze deeply):**
- Business Name: "${business_name}"
- Business Type: "${business_type}" (Consider industry-specific nuances, common customer needs, and typical interaction patterns)
- Business Description: "${business_description}" (Extract key services, value propositions, unique selling points, operational details)
- Product/Service Name: "${product_name}" (Consider how customers would refer to this product)
- Product Description: "${product_description}" (Extract features, benefits, use cases, technical details, customer pain points addressed)
- Target Audience: "${target_audience}" (Consider their knowledge level, communication preferences, common questions, pain points, goals)
- Problem Solved: "${problem}" (This is CRITICAL - understand the core problem deeply, how it affects customers, and how the solution addresses it)
- Brand Voice: "${brand_voice}" (Reflect this voice consistently throughout all generated content)

**DEEP CONTEXT ANALYSIS REQUIRED:**
1. Understand the complete customer journey from first contact to problem resolution
2. Identify the most common customer questions, concerns, and information needs
3. Consider the emotional context - what customers feel when they need this business
4. Understand the technical vs. non-technical aspects based on target audience
5. Extract implicit needs that aren't explicitly stated but are implied by the business type and problem
6. Consider industry best practices and common customer expectations for this business type

**GENERATE JSON with three keys: bot_configs, bot_settings, and bot_runtime_settings**

**For bot_configs (CRITICAL - Make these extremely detailed and personalized):**
- persona: Create a COMPREHENSIVE personality description (200-300 words) that:
  * Reflects the brand voice precisely ("${brand_voice}")
  * Incorporates understanding of the business type ("${business_type}")
  * Shows deep knowledge of the problem solved ("${problem}")
  * Demonstrates empathy for the target audience ("${target_audience}")
  * Includes specific expertise areas relevant to "${product_name}"
  * Shows understanding of customer needs and pain points
  * Reflects the business's approach to customer service
  * Be specific, not generic - reference actual business context

- botthesis: Write a DETAILED core purpose statement (150-200 words) that:
  * Clearly articulates how the chatbot serves "${business_name}"
  * Explains how it helps solve "${problem}" for "${target_audience}"
  * Describes the value proposition specific to "${product_name}"
  * Outlines the chatbot's role in the customer journey
  * Connects to the business description and product description
  * Be mission-driven and specific to this exact business

- greetings: Create a personalized greeting (2-3 sentences) that:
  * Matches the "${brand_voice}" brand voice exactly
  * References "${product_name}" naturally
  * Shows understanding of why the customer might be reaching out
  * Feels warm, helpful, and specific to this business
  * Invites engagement in a way that resonates with "${target_audience}"

- fallback_message: Create a helpful fallback (2-3 sentences) that:
  * Maintains the "${brand_voice}" tone
  * Offers alternative ways to get help
  * Shows empathy and willingness to assist
  * Reflects the business's commitment to customer service
  * Provides next steps or contact information if relevant

- version: 1

**For bot_settings (Use exact values provided):**
- business_name: "${business_name}"
- business_type: "${business_type}"
- business_description: "${business_description}" (use null if empty, otherwise use the exact description)
- product_name: "${product_name}"
- product_description: "${product_description}" (use null if empty, otherwise use the exact description)
- support_email: null
- contacts: null
- supported_languages: ["en"]

**For bot_runtime_settings (Fixed values):**
- rate_limit_per_min: 60
- token_quota: 50000
- api_calls_this_month: 0

**For bot_ui_settings (Generate with deep context):**
- theme: "modern"
- chatbot_name: "${product_name}" (use the exact product name)
- welcome_message: Use the greetings from bot_configs (will be generated above)
- quick_questions: Generate EXACTLY 5 questions that:
  * Are highly specific to "${product_name}" and "${business_type}"
  * Address the core problem: "${problem}"
  * Are relevant to "${target_audience}" and their likely concerns
  * Cover different aspects: getting started, features, pricing, support, use cases
  * Are phrased as customers would naturally ask them
  * Are actionable and helpful
  * Reflect common questions for this business type
  * Consider the customer journey stages
- support_info: null
- position: "bottom-right"
- auto_open_delay_ms: 0
- auto_greet_on_open: false
- ask_email_before_chat: false
- persist_chat: true
- show_timestamps: true

**QUALITY REQUIREMENTS:**
- Every generated field must be specific to THIS business, not generic
- Show deep understanding of the business context
- Make connections between all provided information
- Consider real-world customer interaction scenarios
- Reflect industry knowledge and best practices
- Ensure consistency across all fields (persona, thesis, greetings should align)
- Be precise, detailed, and comprehensive

**CRITICAL ERROR HANDLING:**
- If the provided business information is gibberish, placeholder text (e.g., "asdf", "test", repeated characters), inconsistent, or insufficient to understand the business, you MUST return a JSON response with the following structure:
  {
    "error": "NO_UNDERSTANDING",
    "message": "I cannot understand the provided business information. The data appears to be unclear, incomplete, or nonsensical. Please provide more detailed and clear information about your business."
  }
- Only return this error if the information is truly incomprehensible or insufficient; otherwise proceed with generating the configuration as normal.
- When returning this error, do NOT attempt to fabricate details or make assumptions beyond what is provided.

Return ONLY valid JSON, no markdown, no code blocks, no explanations. The JSON must be parseable and complete. If you cannot understand the business information, return the error JSON structure above.`;

    // 4. Generate configuration using Gemini with enhanced settings for detailed output
    const result = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
      temperature: 0.8, // Slightly higher for more creative and detailed responses
    });

    // Check if Gemini returned a "no understanding" error
    const responseText = result.text.toLowerCase();
    const noUnderstandingPhrases = [
      "no understanding",
      "cannot understand",
      "unable to understand",
      "i don't understand",
      "i do not understand",
      "not enough information",
      "insufficient information",
      "cannot generate",
      "unable to generate",
      "cannot create",
      "unable to create",
    ];

    const hasNoUnderstanding = noUnderstandingPhrases.some((phrase) =>
      responseText.includes(phrase)
    );

    if (hasNoUnderstanding) {
      return NextResponse.json(
        {
          error: "NO_UNDERSTANDING",
          message:
            "The AI could not understand the provided business information. Please provide more detailed and clear information.",
        },
        { status: 400 }
      );
    }

    // 5. Parse the generated JSON
    let generatedData;
    try {
      // Clean the response - remove markdown code blocks if present
      let jsonText = result.text.trim();
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      generatedData = JSON.parse(jsonText);

      // Check if Gemini explicitly returned a NO_UNDERSTANDING error
      if (generatedData.error === "NO_UNDERSTANDING") {
        return NextResponse.json(
          {
            error: "NO_UNDERSTANDING",
            message:
              generatedData.message ||
              "The AI could not understand the provided business information. Please provide more detailed and clear information.",
          },
          { status: 400 }
        );
      }

      // Check if the parsed JSON contains an error or indicates no understanding
      if (generatedData.error || generatedData.message) {
        const errorMessage = (
          generatedData.error ||
          generatedData.message ||
          ""
        ).toLowerCase();
        const noUnderstandingPhrases = [
          "no understanding",
          "cannot understand",
          "unable to understand",
          "i don't understand",
          "i do not understand",
          "not enough information",
          "insufficient information",
          "cannot generate",
          "unable to generate",
          "cannot create",
          "unable to create",
          "gibberish",
          "nonsensical",
          "unclear",
          "incomprehensible",
        ];

        const hasNoUnderstanding = noUnderstandingPhrases.some((phrase) =>
          errorMessage.includes(phrase)
        );

        if (hasNoUnderstanding) {
          return NextResponse.json(
            {
              error: "NO_UNDERSTANDING",
              message:
                "The AI could not understand the provided business information. Please provide more detailed and clear information.",
            },
            { status: 400 }
          );
        }
      }
    } catch {
      console.error("Failed to parse Gemini response:", result.text);
      return NextResponse.json(
        { error: "Failed to parse generated configuration" },
        { status: 500 }
      );
    }

    // 6. Validate and structure the response with enhanced context-rich fallbacks
    const bot_configs = {
      persona:
        generatedData.bot_configs?.persona ||
        `You are a knowledgeable and ${brand_voice} AI assistant representing ${business_name}, a ${business_type} company. Your expertise lies in understanding ${problem} and helping ${target_audience} navigate solutions through ${product_name}. You have deep knowledge of ${
          business_description || business_type
        } and are committed to providing personalized, helpful guidance that reflects ${business_name}'s values and approach to customer service. You communicate in a ${brand_voice} manner that resonates with ${target_audience}, making complex information accessible and actionable.`,
      botthesis:
        generatedData.bot_configs?.botthesis ||
        `As the AI assistant for ${business_name}, my core mission is to empower ${target_audience} by addressing ${problem} through intelligent, personalized support. I serve as the bridge between customers and ${product_name}, helping users understand how our ${business_type} solutions can transform their experience. By combining deep knowledge of ${
          product_description || product_name
        } with an understanding of customer needs, I provide guidance that is both technically accurate and emotionally supportive, ensuring every interaction moves customers closer to achieving their goals.`,
      greetings:
        generatedData.bot_configs?.greetings ||
        `Hello! I'm here to help you with ${product_name} from ${business_name}. Whether you're looking to understand how we solve ${problem} or need guidance on getting started, I'm here to assist you. How can I help you today?`,
      fallback_message:
        generatedData.bot_configs?.fallback_message ||
        `I want to make sure I understand you correctly. Could you rephrase your question? I'm here to help with ${product_name} and can assist with questions about ${
          business_description || business_type
        }. If you need immediate assistance, please feel free to reach out to our support team.`,
      version: 1,
    };

    const bot_settings = {
      business_name,
      business_type,
      business_description: business_description || null,
      product_name,
      product_description: product_description || null,
      support_email: null,
      contacts: null,
      supported_languages: ["en"],
    };

    const bot_runtime_settings = {
      rate_limit_per_min: 60,
      token_quota: 50000,
      api_calls_this_month: 0,
    };

    // Generate 5 quick questions using Gemini
    let quickQuestions: string[] = [];
    try {
      const questionsPrompt = isPersonalProject
        ? `You are an expert at understanding visitor needs and generating highly relevant, specific questions that visitors would naturally ask about personal projects.

      **CRITICAL CONTEXT:**
      - Project: ${business_name} (${business_type})
      - Bot/Assistant: ${product_name}
      - Bot Description: ${product_description || "Not provided"}
      - Core Purpose: ${problem}
      - Target Audience: ${target_audience}
      - Project Description: ${business_description || "Not provided"}

      **REQUIREMENTS FOR QUESTIONS:**
      1. Generate EXACTLY 5 questions that are highly specific to this exact project and bot
      2. Questions must address different aspects of the visitor experience:
        - Getting started/interaction
        - Understanding capabilities/features
        - Learning about the purpose: "${problem}"
        - Use cases and applications
        - General information
      3. Questions should be phrased exactly as ${target_audience} would naturally ask them
      4. Each question should be actionable and show clear intent
      5. Questions must reflect understanding of "${business_type}" project context
      6. Make questions specific to "${product_name}" - not generic
      7. Consider the interests and goals of "${target_audience}"
      8. Questions should help visitors understand how "${product_name}" serves "${problem}"
      9. For personal projects, questions should feel more casual and authentic
      10. Focus on curiosity, learning, and engagement rather than business transactions

      **EXAMPLES OF GOOD QUESTIONS FOR PERSONAL PROJECTS:**
      - Specific to the project and purpose
      - Show understanding of visitor interests
      - Cover different stages of interaction
      - Are naturally phrased
      - Are actionable
      - Are not too long or complex
      - Actually what a visitor would ask

      Return ONLY a JSON array of exactly 5 strings, no markdown, no code blocks, no explanations. Example: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`
        : `You are an expert at understanding customer needs and generating highly relevant, specific questions that customers would naturally ask.

      **CRITICAL CONTEXT:**
      - Business: ${business_name} (${business_type})
      - Product/Service: ${product_name}
      - Product Description: ${product_description || "Not provided"}
      - Core Problem Solved: ${problem}
      - Target Audience: ${target_audience}
      - Business Description: ${business_description || "Not provided"}

      **REQUIREMENTS FOR QUESTIONS:**
      1. Generate EXACTLY 5 questions that are highly specific to this exact business and product
      2. Questions must address different aspects of the customer journey:
        - Getting started/onboarding
        - Understanding features/capabilities
        - Solving the core problem: "${problem}"
        - Use cases and applications
        - Support and next steps
      3. Questions should be phrased exactly as ${target_audience} would naturally ask them
      4. Each question should be actionable and show clear intent
      5. Questions must reflect understanding of "${business_type}" industry context
      6. Make questions specific to "${product_name}" - not generic
      7. Consider the emotional context and pain points of "${target_audience}"
      8. Questions should help customers understand how "${product_name}" solves "${problem}"

      **EXAMPLES OF GOOD QUESTIONS:**
      - Specific to the product and problem
      - Show understanding of customer needs
      - Cover different stages of customer journey
      - Are naturally phrased
      - Are actionable
      - Are not too long or complex
      - Actually what the user would ask

      Return ONLY a JSON array of exactly 5 strings, no markdown, no code blocks, no explanations. Example: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;

      const questionsResult = await generateText({
        model: google("gemini-2.0-flash"),
        prompt: questionsPrompt,
        temperature: 0.8, // Higher temperature for more creative, context-aware questions
      });

      let questionsText = questionsResult.text.trim();
      if (questionsText.startsWith("```json")) {
        questionsText = questionsText
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (questionsText.startsWith("```")) {
        questionsText = questionsText
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      quickQuestions = JSON.parse(questionsText);
      if (!Array.isArray(quickQuestions) || quickQuestions.length !== 5) {
        throw new Error("Invalid questions format");
      }
      // Ensure we have exactly 5 questions
      quickQuestions = quickQuestions
        .slice(0, 5)
        .filter((q) => q && typeof q === "string");
      while (quickQuestions.length < 5) {
        quickQuestions.push("");
      }
    } catch (err) {
      console.error("Failed to generate questions, using defaults:", err);
      // Fallback questions
      quickQuestions = [
        `What is ${product_name}?`,
        `How does ${product_name} work?`,
        `What are the benefits of ${product_name}?`,
        `How can I get started with ${product_name}?`,
        `What support options are available?`,
      ];
    }

    const bot_ui_settings = {
      theme: "modern",
      chatbot_name: product_name,
      welcome_message:
        bot_configs.greetings ||
        `Hello! I'm here to help you with ${product_name}. How can I assist you today?`,
      quick_questions: quickQuestions,
      support_info: null,
      position: "bottom-right",
      auto_open_delay_ms: 0,
      auto_greet_on_open: false,
      ask_email_before_chat: false,
      persist_chat: true,
      show_timestamps: true,
    };

    // 7. Return the generated configuration
    return NextResponse.json({
      bot_configs,
      bot_settings,
      bot_runtime_settings,
      bot_ui_settings,
    });
  } catch (err) {
    console.error("GENERATE CONFIG ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

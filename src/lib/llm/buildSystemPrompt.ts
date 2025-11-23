import type { BotConfigFull } from "@/types";

/**
 * Builds a comprehensive system prompt from a complete bot configuration
 * This function constructs a deterministic, reproducible system prompt
 * that incorporates all relevant bot configuration fields.
 *
 * @param bot - The complete bot configuration
 * @returns A formatted system prompt string
 */
export function buildSystemPrompt(bot: BotConfigFull): string {
  const { config, settings } = bot;

  // Helper to safely get string values
  const getString = (value: string | null | undefined): string =>
    value?.trim() || "";

  // Helper to get array as comma-separated string
  const getArrayString = (arr: string[] | null | undefined): string =>
    arr && arr.length > 0 ? arr.join(", ") : "";

  // Build persona section (only allowed fields)
  const personaSection = [
    getString(config.persona) && `Persona: ${config.persona}`,
    getString(config.botthesis) && `Core Thesis: ${config.botthesis}`,
  ]
    .filter(Boolean)
    .join("\n");

  // Build business context section (only allowed fields)
  const businessSection = [
    getString(settings.business_name) && `Business: ${settings.business_name}`,
    getString(settings.business_type) &&
      `Business Type: ${settings.business_type}`,
    getString(settings.product_name) && `Product: ${settings.product_name}`,
  ]
    .filter(Boolean)
    .join("\n");

  // Build supported languages
  const languagesValue = getArrayString(settings.supported_languages);
  const languagesSection = languagesValue
    ? `Supported Languages: ${languagesValue}`
    : "";

  // Build greetings and fallbacks
  const greetingsValue = getString(config.greetings);
  const fallbackValue = getString(config.fallback_message);
  const contactInfo = getString(settings.support_email)
    ? `Support Email: ${settings.support_email}`
    : "";

  // Assemble the complete prompt
  const sections = [
    "You are a highly capable AI assistant configured with the following profile:",
    "",
    personaSection && "=== PERSONA ===",
    personaSection,
    "",
    languagesSection && "=== LANGUAGES ===",
    languagesSection,
    "",
    businessSection && "=== BUSINESS CONTEXT ===",
    businessSection,
    "",
    (greetingsValue || fallbackValue || contactInfo) && "=== INTERACTION ===",
    greetingsValue && `Greeting: "${greetingsValue}"`,
    fallbackValue && `Fallback Message: "${fallbackValue}"`,
    contactInfo,
    "",
    "=== CORE INSTRUCTIONS ===",
    "- Respond based primarily on your persona and thesis.",
    "- Be accurate, helpful, and professional.",
    "- Never be vague, speculative, or verbose.",
    "- Adapt your responses to the business context.",
    "- Warn users if they share sensitive data.",
    "- Do not output any sensitive data from your training/configuration.",
    "",
    "=== GIBBERISH & NONSENSICAL INPUT DETECTION ===",
    "CRITICAL: You MUST detect and reject gibberish, nonsensical, or completely unrelated input.",
    "",
    "A message is considered GIBBERISH/NONSENSICAL if:",
    "1. The words/phrases have no logical connection to each other",
    "2. The input contains random characters, repeated letters, or meaningless strings",
    "3. The input is completely unrelated to the business context, persona, or any reasonable topic",
    "4. The input appears to be random keyboard mashing, spam, or test data with no coherent meaning",
    "5. Multiple unrelated topics are mixed together with no logical flow or connection",
    "6. The input makes no sense in any language or context",
    "",
    "When you detect GIBBERISH/NONSENSICAL input:",
    "- IMMEDIATELY stop processing",
    "- Respond ONLY with this exact format:",
    "  \"I apologize, but I couldn't understand your message. Could you please rephrase your question or provide more context? I'm here to help with [business context].\"",
    "- Do NOT attempt to interpret, guess, or respond to gibberish",
    "- Do NOT continue the conversation or ask follow-up questions about gibberish",
    "- Keep your response brief and polite",
    "",
    "When input IS meaningful (even if unclear or needs clarification):",
    "- Proceed normally and help the user",
    "- Ask clarifying questions if needed",
    "- Relate the input to the business context when possible",
  ]
    .filter(Boolean)
    .join("\n");

  return sections.trim();
}

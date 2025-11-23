import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { getBotProfile, lookupApiKey } from "@/lib/db/bot";
import { buildSystemPrompt } from "@/lib/llm/buildSystemPrompt";
import { logChat } from "@/lib/db/chat-logs";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isObviousGibberish } from "@/lib/utils/gibberish-detection";

export const runtime = "nodejs";

/* ---------------------------------------------
   Validation Schemas
--------------------------------------------- */
const BotIdSchema = z.object({
  bot_id: z.string().min(1),
});

const ChatHistoryEntrySchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.string(),
});

const ChatPayloadSchema = z.object({
  message: z.string().min(1),
  chat_history: z.array(ChatHistoryEntrySchema).default([]),
  // optional fields for debugging/metrics
  model_override: z.string().optional(),
});

interface FileData {
  name: string;
  type: string;
  data: Buffer;
}

interface ParsedRequest {
  message: string;
  files?: FileData[];
  chat_history: Array<{ role: string; content: string; timestamp: string }>;
  model_override?: string | undefined;
}

/* ---------------------------------------------
   Route Handler
--------------------------------------------- */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bot_id: string }> }
) {
  try {
    // 1. Validate bot_id
    const { bot_id } = await params;
    const { bot_id: validatedBotId } = BotIdSchema.parse({ bot_id });

    // 2. Require session ID header (for widget sessions)
    const sessionId = req.headers.get("x-session-id");
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required (x-session-id header)" },
        { status: 400 }
      );
    }

    // 3. Parse request body - support both JSON and FormData
    const contentType = req.headers.get("content-type") || "";
    let parsedRequest: ParsedRequest = { message: "", chat_history: [] };

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const message = formData.get("message")?.toString() || "";
      const chatHistoryStr = formData.get("chat_history")?.toString();
      const modelOverride = formData.get("model_override")?.toString();

      let chatHistory: Array<{
        role: string;
        content: string;
        timestamp: string;
      }> = [];
      if (chatHistoryStr) {
        try {
          const parsed = JSON.parse(chatHistoryStr);
          chatHistory = z.array(ChatHistoryEntrySchema).parse(parsed);
        } catch {
          chatHistory = [];
        }
      }

      const files: FileData[] = [];
      let fileIndex = 0;
      while (formData.has(`file_${fileIndex}`)) {
        const file = formData.get(`file_${fileIndex}`) as File;
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          files.push({
            name: file.name,
            type: file.type,
            data: Buffer.from(arrayBuffer),
          });
        }
        fileIndex++;
      }

      parsedRequest = {
        message,
        files: files.length ? files : undefined,
        chat_history: chatHistory,
        model_override: modelOverride ?? undefined,
      };
    } else {
      const json = await req.json();
      const parsed = ChatPayloadSchema.parse(json);
      parsedRequest = {
        message: parsed.message,
        chat_history: parsed.chat_history || [],
        model_override: parsed.model_override,
      };
    }

    // 4. Authentication - API key (server-to-server) optional
    const auth = req.headers.get("authorization") || "";
    const isApiKey = auth.toLowerCase().startsWith("bearer ");
    let apiKeyRow: Awaited<ReturnType<typeof lookupApiKey>> = null;

    if (isApiKey) {
      const token = auth.replace(/^bearer\s+/i, "").trim();
      if (!token) return new NextResponse("Missing API key", { status: 401 });

      apiKeyRow = await lookupApiKey(token);
      if (!apiKeyRow)
        return new NextResponse("Invalid API key", { status: 401 });

      if (apiKeyRow.bot_id !== validatedBotId) {
        return new NextResponse("API key not authorized for this bot", {
          status: 403,
        });
      }
    }

    // 5. Pre-check for obvious gibberish (early rejection)
    if (isObviousGibberish(parsedRequest.message)) {
      // Log the gibberish attempt
      await logChat({
        supabase: supabaseAdmin,
        botId: validatedBotId,
        sessionId: sessionId,
        role: "user",
        message: parsedRequest.message,
        history: parsedRequest.chat_history || [],
      }).catch(() => {}); // Don't block on logging errors

      // Return a clear error response
      return NextResponse.json(
        {
          error:
            "I apologize, but I couldn't understand your message. Could you please rephrase your question or provide more context?",
          type: "gibberish_detected",
        },
        { status: 400 }
      );
    }

    // 6. Load bot profile and build system prompt
    const bot = await getBotProfile(validatedBotId);
    if (!bot) return new NextResponse("Bot not found", { status: 404 });

    const systemPrompt = buildSystemPrompt(bot);

    // 7. Prepare message content (files handled if present)
    type TextPart = { type: "text"; text: string };
    type ImagePart = { type: "image"; image: string };
    type ContentPart = TextPart | ImagePart;

    let userContent: string | ContentPart[];
    if (parsedRequest.files && parsedRequest.files.length > 0) {
      const contentParts: ContentPart[] = [];
      if (
        parsedRequest.message &&
        parsedRequest.message !== "(No text message)"
      ) {
        contentParts.push({ type: "text", text: parsedRequest.message });
      }
      for (const file of parsedRequest.files) {
        if (file.type.startsWith("image/")) {
          const base64 = file.data.toString("base64");
          contentParts.push({
            type: "image",
            image: `data:${file.type};base64,${base64}`,
          });
        } else {
          contentParts.push({
            type: "text",
            text: `[User attached file: ${file.name} (${file.type})]`,
          });
        }
      }
      userContent = contentParts;
    } else {
      userContent = parsedRequest.message;
    }

    // 8. Convert chat_history to Gemini messages (exclude system types or keep if needed)
    const historyMessages: Array<{
      role: "user" | "assistant";
      content: string;
    }> = parsedRequest.chat_history
      .filter((entry) => entry.role !== "system")
      .map((entry) => ({
        role: (entry.role === "user" ? "user" : "assistant") as
          | "user"
          | "assistant",
        content: entry.content,
      }));

    // 9. Determine model to use
    const modelName =
      parsedRequest.model_override ||
      process.env.DEFAULT_GEMINI_MODEL ||
      "gemini-2.0-flash";
    const resolvedModel = modelName;

    // 10. Start timing for response time tracking
    const startTs = Date.now();

    // 11. Stream LLM response using Google Gemini (streamText)
    const result = streamText({
      model: google(modelName.replace(/^gemini\:/i, "")),
      system: systemPrompt,
      messages: [...historyMessages, { role: "user", content: userContent }],
    });

    // 12. Set up streaming + capture response for logging (tokens & timing)
    const stream = result.toTextStreamResponse();
    const originalBody = stream.body;
    if (!originalBody) return stream;

    const reader = originalBody.getReader();
    const decoder = new TextDecoder();
    let finalBotResponseText = "";

    const newStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              // finalize
              const responseTimeMs = Date.now() - startTs;
              const tokensUsed = Math.ceil(finalBotResponseText.length / 4);

              // asynchronous logging: do not block client response
              Promise.resolve()
                .then(async () => {
                  try {
                    // log user message row
                    await logChat({
                      supabase: supabaseAdmin,
                      botId: validatedBotId,
                      sessionId: sessionId,
                      role: "user",
                      message: parsedRequest.message,
                      history: parsedRequest.chat_history || [],
                      tokensUsed: undefined,
                      responseTimeMs: undefined,
                      model: resolvedModel,
                    });

                    // log assistant message row
                    await logChat({
                      supabase: supabaseAdmin,
                      botId: validatedBotId,
                      sessionId: sessionId,
                      role: "assistant",
                      message: finalBotResponseText,
                      history: parsedRequest.chat_history || [],
                      tokensUsed,
                      responseTimeMs,
                      model: resolvedModel,
                    });
                  } catch (logError) {
                    // swallow to avoid affecting response
                    console.error("Failed to log chat:", logError);
                  }
                })
                .catch((err) => {
                  console.error("Unhandled error in logging promise:", err);
                });

              controller.close();
              break;
            }

            // forward chunk to client while collecting
            try {
              const chunkText = decoder.decode(value, { stream: true });
              finalBotResponseText += chunkText;
            } catch (err) {
              // If decode fails, still forward raw bytes
              console.warn("Decode chunk failed:", err);
            }

            controller.enqueue(value);
          }
        } catch (error) {
          console.error("Stream processing error:", error);
          const responseTimeMs = Date.now() - startTs;
          // Attempt to log error entry
          try {
            await logChat({
              supabase: supabaseAdmin,
              botId: validatedBotId,
              sessionId: sessionId,
              role: "assistant",
              message: "",
              history: parsedRequest.chat_history || [],
              tokensUsed: undefined,
              responseTimeMs,
              model: resolvedModel,
              isError: true,
            });
          } catch (e) {
            console.error("Failed to log stream error:", e);
          }
          controller.error(error);
        }
      },
    });

    // Return streaming response to client with same headers
    return new NextResponse(newStream, {
      headers: stream.headers,
      status: stream.status,
      statusText: stream.statusText,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 400 }
      );
    }
    console.error("CHAT ROUTE ERROR:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

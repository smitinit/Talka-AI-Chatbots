import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sha256 } from "js-sha256";
import { supabaseAdmin } from "@/db/supabase/supabase-admin";
import {
  getCachedApiKey,
  getCachedBotProfile,
  setCachedApiKey,
  setCachedBotProfile,
} from "@/lib/cache";
import { BotConfigType } from "@/features/config/configSchema";
import { BotRuntimeSettingsType } from "@/features/runtime/runtimeSchema";
import { BotSettingsType } from "@/features/settings/settingsSchema";

import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const runtime = "nodejs";
export const maxDuration = 60;

/* ── helper to verify mesh token ──────────────────────────────── */
function verifyApiMeshToken(token: string) {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;

  const secret = process.env.API_MESH_SECRET;
  if (!secret) throw new Error("API_MESH_SECRET not set");

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("hex");

  if (
    expected.length !== sig.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  )
    return null;

  const [rawToken, botId, userId, iatStr, expStr] = Buffer.from(
    payloadB64,
    "base64url"
  )
    .toString()
    .split("|");

  const exp = Number(expStr);
  if (Date.now() > exp) return null;

  return { rawToken, botId, userId, iat: Number(iatStr), exp };
}

/* ── POST /api/bot/[bot_id]/validate ──────────────────────────────────── */
export async function POST(
  req: NextRequest,
  { params }: { params: { bot_id: string } }
) {
  const botParam = params.bot_id;
  console.log(`[Auth] Request to validate bot ${botParam}`);

  // 1 — Auth header
  const authHeader =
    req.headers.get("x-bot-auth") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!authHeader) {
    console.warn(`[Auth] Missing token for bot ${botParam}`);
    return NextResponse.json(
      { error: "Missing API token", err_code: "TOKEN_MISSING" },
      { status: 401 }
    );
  }

  // 2 — Verify token
  const parts = verifyApiMeshToken(authHeader);
  if (!parts) {
    console.warn(`[Auth] Invalid or expired token for bot ${botParam}`);
    return NextResponse.json(
      { error: "Invalid or expired token", err_code: "TOKEN_INVALID" },
      { status: 401 }
    );
  }

  const { rawToken, botId: botInToken } = parts;

  if (botInToken !== botParam || !rawToken) {
    console.warn(
      `[Auth] Token bot_id mismatch: token(${botInToken}) vs param(${botParam})`
    );
    return NextResponse.json(
      { error: "Bot mismatch", err_code: "BOT_MISMATCH" },
      { status: 403 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch (parseError) {
    console.error("Failed to parse request body:", parseError);
    return Response.json(
      { error: "Invalid request format: Request body must be valid JSON" },
      { status: 400 }
    );
  }
  const { messages } = body;

  // 3 — Check cached API key
  const hash = sha256(rawToken);
  let keyRow = await getCachedApiKey(hash);

  if (keyRow) {
    console.log(`[Cache] API key cache hit for bot ${botParam}`);
  } else {
    console.log(
      `[DB] API key cache miss. Fetching from DB for bot ${botParam}`
    );
    const { data, error } = await supabaseAdmin
      .from("api_keys")
      .select("api_id, permissions, name")
      .eq("bot_id", botParam)
      .eq("token_hash", hash)
      .maybeSingle();

    if (error || !data) {
      console.warn(`[Auth] API key not found or revoked for bot ${botParam}`);
      return NextResponse.json(
        { error: "Key revoked or not found", err_code: "KEY_REVOKED" },
        { status: 403 }
      );
    }

    keyRow = data;
    await setCachedApiKey(hash, keyRow);
    console.log(`[Cache] API key cached for bot ${botParam}`);
  }

  // 4 — Check cached bot profile
  let BotProfile = await getCachedBotProfile(botParam);
  if (BotProfile) {
    console.log(`[Cache] Bot profile cache hit for bot ${botParam}`);
  } else {
    console.log(
      `[DB] Bot profile cache miss. Fetching config/settings/runtime for bot ${botParam}`
    );

    const { data: config, error: configErr } = await supabaseAdmin
      .from("bot_configs")
      .select("*")
      .eq("bot_id", botParam)
      .maybeSingle();

    if (configErr || !config) {
      console.error(`[DB] Bot config missing for bot ${botParam}`);
      return NextResponse.json(
        { error: "Bot config not found", err_code: "CONFIG_MISSING" },
        { status: 404 }
      );
    }

    const [runtimeRes, settingsRes] = await Promise.all([
      supabaseAdmin
        .from("bot_runtime_settings")
        .select("*")
        .eq("bot_id", botParam)
        .maybeSingle(),
      supabaseAdmin
        .from("bot_settings")
        .select("*")
        .eq("bot_id", botParam)
        .maybeSingle(),
    ]);

    if (
      runtimeRes.error ||
      !runtimeRes.data ||
      settingsRes.error ||
      !settingsRes.data
    ) {
      console.error(
        `[DB] Bot settings or runtime settings missing for bot ${botParam}`
      );
      return NextResponse.json(
        {
          error: "Missing runtime or base settings",
          err_code: "SETTINGS_MISSING",
        },
        { status: 404 }
      );
    }

    BotProfile = {
      config,
      runtime_settings: runtimeRes.data,
      settings: settingsRes.data,
      fetchedAt: new Date().toISOString(),
    };

    await setCachedBotProfile(botParam, BotProfile);
    console.log(`[Cache] Bot profile cached for bot ${botParam}`);
  }

  // 5 — Permissions check
  if (!keyRow.permissions.includes("read")) {
    console.warn(`[Auth] Permission "read" missing for key on bot ${botParam}`);
    return NextResponse.json(
      { error: "Missing permission", err_code: "PERMISSION_DENIED" },
      { status: 403 }
    );
  }

  const geminiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!geminiApiKey) {
    console.error("GOOGLE_GENERATIVE_AI_API_KEY not configured");
    return Response.json(
      {
        error:
          "API configuration error: GOOGLE_GENERATIVE_AI_API_KEY is not configured",
      },
      { status: 500 }
    );
  }
  const systemPrompt = generateSystemPrompt(BotProfile);

  try {
    const result = await streamText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      messages,
      temperature: BotProfile.settings.temperature ?? 0.7,
      maxTokens: BotProfile.settings.max_tokens ?? 1000,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error(`[Gemini] Streaming failed:`, err);
    return NextResponse.json(
      { error: "Gemini streaming failed", err_code: "GENERIC_ERROR" },
      { status: 500 }
    );
  }

  // console.log(result);

  // return NextResponse.json({
  //   ok: true,
  //   bot_id: botParam,
  //   result,
  //   config_fingerprint: configFingerprint,
  //   from_cache: true,
  // });
}

type FullBotProfile = {
  config: BotConfigType;
  runtime_settings: BotRuntimeSettingsType;
  settings: BotSettingsType;
};

export function generateSystemPrompt(profile: FullBotProfile): string {
  const { config, runtime_settings, settings } = profile;

  const prompt = `
    You are a highly capable AI assistant. Respond with clarity, accuracy, and purpose.

    🔹 Persona: ${config.persona || "N/A"}
    🔹 Backstory: ${config.backstory || "N/A"}
    🔹 Primary Objective: ${config.goals || "N/A"}
    🔹 Thesis: ${config.botthesis || "N/A"}

    🔹 Tone: ${config.tone_style || "neutral"}
    🔹 Style: ${config.writing_style || "plain"}
    🔹 Response Behavior: ${config.response_style || "balanced"}
    🔹 Output Format: ${config.output_format || "plain text"}
    🔹 Language: ${
      config.language_preference || config.default_language || "en"
    }
    🔹 Audience: ${config.target_audience || "general public"}
    🔹 Expertise: ${config.customexpertise || config.expertise || "general"}
    🔹 Focus Domains: ${(settings.focus_domains || []).join(", ") || "general"}

    🔹 Use Emojis: ${config.use_emojis ? "Yes" : "No"}
    🔹 Cite Sources: ${config.include_citations ? "Yes" : "No"}
    🔹 JSON Mode: ${settings.json_mode ? "Enabled" : "Disabled"}

    🧠 Memory: ${runtime_settings.memory_type || "none"} (expires in ${
    runtime_settings.memory_expiration || "n/a"
  })
    🌍 Web Access: ${runtime_settings.use_web_search ? "Enabled" : "Disabled"}
    🔊 Voice: ${runtime_settings.voice || "default"} (${
    runtime_settings.gender || "neutral"
  }), Mode: ${runtime_settings.voice_mode ? "On" : "Off"}

    ⚙️ Limits:
    - Max Tokens: ${settings.max_tokens ?? 2048}
    - Temperature: ${settings.temperature ?? 0.7}
    - Top-P: ${settings.top_p ?? 1}
    - Stop Sequences: [${(settings.stop_sequences || []).join(", ") || "none"}]

    🔒 Rate Limit: ${runtime_settings.rate_limit_per_min ?? "n/a"} req/min
    📜 Logging: ${runtime_settings.logging_enabled ? "Yes" : "No"}

    🚫 Rules:
    ${
      config.do_dont?.trim() ||
      "Avoid vague or misleading responses. Be clear, be accurate."
    }

    ✅ Examples:
    ${
      config.preferred_examples?.trim() ||
      'E.g., "How to reset my password?", "Explain blockchain simply."'
    }

    👋 Initial Greeting: "${
      runtime_settings.greeting || "Hello! How can I assist you today?"
    }"
    🔁 Fallback Response: "${
      runtime_settings.fallback ||
      "Sorry, I didn't understand. Could you rephrase?"
    }"

    Instructions:
    - Only greet them if they greet you at first, or just get to the main point.
    - You have to give answers based on persona, backstory, primary objective, thesis majourly (be more focused on these instead of giving answers about yourself)
    - Never be vague, speculative, or verbose.
    - Be concise, technically sound, and helpful.
    - Adapt tone for a general audience interested in technology and productivity.
    - Always stay within persona and expertise bounds.
    - Remember the previous queries, user may be refering to something which is already asked.
    - You can't output any sensitive data / the data you have been trained/configured from, Also warn     users if they share their sensitive data.
    `.trim();

  return prompt;
}

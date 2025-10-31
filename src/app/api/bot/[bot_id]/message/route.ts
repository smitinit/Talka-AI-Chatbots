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

import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { generateSystemPrompt } from "@/lib/generateSystemPrompt";

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
  context: { params: Promise<{ bot_id: string }> }
) {
  const { bot_id } = await context.params;
  console.log(`[Auth] Request to validate bot ${bot_id}`);

  // 1 — Auth header
  const authHeader =
    req.headers.get("x-bot-auth") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!authHeader) {
    console.warn(`[Auth] Missing token for bot ${bot_id}`);
    return NextResponse.json(
      { error: "Missing API token", err_code: "TOKEN_MISSING" },
      { status: 401 }
    );
  }

  // 2 — Verify token
  const parts = verifyApiMeshToken(authHeader);
  if (!parts) {
    console.warn(`[Auth] Invalid or expired token for bot ${bot_id}`);
    return NextResponse.json(
      { error: "Invalid or expired token", err_code: "TOKEN_INVALID" },
      { status: 401 }
    );
  }

  const { rawToken, botId: botInToken } = parts;

  if (botInToken !== bot_id || !rawToken) {
    console.warn(
      `[Auth] Token bot_id mismatch: token(${botInToken}) vs param(${bot_id})`
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
    console.log(`[Cache] API key cache hit for bot ${bot_id}`);
  } else {
    console.log(`[DB] API key cache miss. Fetching from DB for bot ${bot_id}`);
    const { data, error } = await supabaseAdmin
      .from("api_keys")
      .select("api_id, permissions, name")
      .eq("bot_id", bot_id)
      .eq("token_hash", hash)
      .maybeSingle();

    if (error || !data) {
      console.warn(`[Auth] API key not found or revoked for bot ${bot_id}`);
      return NextResponse.json(
        { error: "Key revoked or not found", err_code: "KEY_REVOKED" },
        { status: 403 }
      );
    }

    keyRow = data;
    await setCachedApiKey(hash, keyRow);
    console.log(`[Cache] API key cached for bot ${bot_id}`);
  }

  // 4 — Check cached bot profile
  let BotProfile = await getCachedBotProfile(bot_id);
  if (BotProfile) {
    console.log(`[Cache] Bot profile cache hit for bot ${bot_id}`);
  } else {
    console.log(
      `[DB] Bot profile cache miss. Fetching config/settings/runtime for bot ${bot_id}`
    );

    const { data: config, error: configErr } = await supabaseAdmin
      .from("bot_configs")
      .select("*")
      .eq("bot_id", bot_id)
      .maybeSingle();

    if (configErr || !config) {
      console.error(`[DB] Bot config missing for bot ${bot_id}`);
      return NextResponse.json(
        { error: "Bot config not found", err_code: "CONFIG_MISSING" },
        { status: 404 }
      );
    }

    const [runtimeRes, settingsRes] = await Promise.all([
      supabaseAdmin
        .from("bot_runtime_settings")
        .select("*")
        .eq("bot_id", bot_id)
        .maybeSingle(),
      supabaseAdmin
        .from("bot_settings")
        .select("*")
        .eq("bot_id", bot_id)
        .maybeSingle(),
    ]);

    if (
      runtimeRes.error ||
      !runtimeRes.data ||
      settingsRes.error ||
      !settingsRes.data
    ) {
      console.error(
        `[DB] Bot settings or runtime settings missing for bot ${bot_id}`
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

    await setCachedBotProfile(bot_id, BotProfile);
    console.log(`[Cache] Bot profile cached for bot ${bot_id}`);
  }

  // 5 — Permissions check
  if (!keyRow.permissions.includes("read")) {
    console.warn(`[Auth] Permission "read" missing for key on bot ${bot_id}`);
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
  //   bot_id: bot_id,
  //   result,
  //   config_fingerprint: configFingerprint,
  //   from_cache: true,
  // });
}

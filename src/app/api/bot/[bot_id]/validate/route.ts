// import { NextRequest, NextResponse } from "next/server";
// import crypto, { createHash } from "crypto";
// import { sha256 } from "js-sha256";
// import { supabaseAdmin } from "@/db/supabase/supabase-admin";
// import {
//   getCachedApiKey,
//   getCachedBotProfile,
//   setCachedApiKey,
//   setCachedBotProfile,
// } from "@/lib/cache";

// export const runtime = "nodejs";

// /* ── helper to verify mesh token ──────────────────────────────── */
// function verifyApiMeshToken(token: string) {
//   const [payloadB64, sig] = token.split(".");
//   if (!payloadB64 || !sig) return null;

//   const secret = process.env.API_MESH_SECRET;
//   if (!secret) throw new Error("API_MESH_SECRET not set");

//   // Re-create signature
//   const expected = crypto
//     .createHmac("sha256", secret)
//     .update(payloadB64)
//     .digest("hex");

//   // timing-safe compare
//   if (
//     expected.length !== sig.length ||
//     !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
//   )
//     return null;

//   // Decode payload: rawToken|bot_id|user_id|iat|exp
//   const [rawToken, botId, userId, iatStr, expStr] = Buffer.from(
//     payloadB64,
//     "base64url"
//   )
//     .toString()
//     .split("|");

//   const exp = Number(expStr);
//   if (Date.now() > exp) return null;

//   return { rawToken, botId, userId, iat: Number(iatStr), exp };
// }

// /* ── POST /api/bot/[bot_id]/validate ──────────────────────────────────── */
// export async function POST(
//   req: NextRequest,
//   { params }: { params: { bot_id: string } }
// ) {
//   const botParam = params.bot_id;

//   /* 1 — Grab & verify mesh token */
//   const authHeader =
//     req.headers.get("x-bot-auth") ??
//     req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

//   if (!authHeader) {
//     return NextResponse.json(
//       { error: "Missing API token", err_code: "TOKEN_MISSING" },
//       { status: 401 }
//     );
//   }

//   const parts = verifyApiMeshToken(authHeader);
//   if (!parts) {
//     return NextResponse.json(
//       { error: "Invalid or expired token", err_code: "TOKEN_INVALID" },
//       { status: 401 }
//     );
//   }

//   const { rawToken, botId: botInToken } = parts;

//   /* 2 — Param / payload mismatch guard */
//   if (botInToken !== botParam || !rawToken) {
//     return NextResponse.json(
//       { error: "Bot mismatch", err_code: "BOT_MISMATCH" },
//       { status: 403 }
//     );
//   }

//   /* 3 — DB lookup, revocation, permissions and chaching*/
//   const hash = sha256(rawToken);
//   let keyRow = await getCachedApiKey(hash);

//   if (!keyRow) {
//     const { data, error } = await supabaseAdmin
//       .from("api_keys")
//       .select("api_id, permissions, name")
//       .eq("bot_id", botParam)
//       .eq("token_hash", hash)
//       .maybeSingle();

//     if (error || !data) {
//       return NextResponse.json(
//         { error: "Key revoked or not found", err_code: "KEY_REVOKED" },
//         { status: 403 }
//       );
//     }

//     keyRow = data;
//     await setCachedApiKey(hash, keyRow);
//   }

//   let BotProfile = await getCachedBotProfile(botInToken);
//   if (BotProfile) {
//     const { data: config, error: configErr } = await supabaseAdmin
//       .from("bot_configs")
//       .select("*")
//       .eq("bot_id", botParam)
//       .maybeSingle();

//     if (configErr || !config) {
//       return NextResponse.json(
//         { error: "Bot config not found", err_code: "CONFIG_MISSING" },
//         { status: 404 }
//       );
//     }
//     const [runtimeRes, settingsRes] = await Promise.all([
//       supabaseAdmin
//         .from("bot_runtime_settings")
//         .select("*")
//         .eq("bot_id", botParam)
//         .maybeSingle(),
//       supabaseAdmin
//         .from("bot_settings")
//         .select("*")
//         .eq("bot_id", botParam)
//         .maybeSingle(),
//     ]);

//     if (
//       runtimeRes.error ||
//       !runtimeRes.data ||
//       settingsRes.error ||
//       !settingsRes.data
//     ) {
//       return NextResponse.json(
//         {
//           error: "Missing runtime or base settings",
//           err_code: "SETTINGS_MISSING",
//         },
//         { status: 404 }
//       );
//     }

//     BotProfile = {
//       config,
//       runtime_settings: runtimeRes.data,
//       settings: settingsRes.data,
//       fetchedAt: new Date().toISOString(),
//     };

//     if (BotProfile) {
//       await setCachedBotProfile(botInToken, BotProfile);
//     }

//     if (!keyRow.permissions.includes("read")) {
//       return NextResponse.json(
//         { error: "Missing permission", err_code: "PERMISSION_DENIED" },
//         { status: 403 }
//       );
//     }
//     const configFingerprint = createHash("sha256")
//       .update(JSON.stringify(config))
//       .digest("hex");

//     return NextResponse.json({
//       ok: true,
//       bot_id: botParam,
//       config,
//       runtime_settings: runtimeRes.data,
//       settings: settingsRes.data,
//       config_fingerprint: configFingerprint,
//     });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import crypto, { createHash } from "crypto";
import { sha256 } from "js-sha256";
import { supabaseAdmin } from "@/db/supabase/supabase-admin";
import {
  getCachedApiKey,
  getCachedBotProfile,
  setCachedApiKey,
  setCachedBotProfile,
} from "@/lib/cache";

export const runtime = "nodejs";

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
export async function POST(req: NextRequest, params: { bot_id: string }) {
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

  const configFingerprint = createHash("sha256")
    .update(JSON.stringify(BotProfile.config))
    .digest("hex");

  console.log(
    `[Auth] ✅ Bot ${botParam} validated. Key: ${
      keyRow.name
    }, Permissions: ${keyRow.permissions.join(", ")}`
  );

  return NextResponse.json({
    ok: true,
    bot_id: botParam,
    config: BotProfile.config,
    runtime_settings: BotProfile.runtime_settings,
    settings: BotProfile.settings,
    config_fingerprint: configFingerprint,
    from_cache: true,
  });
}

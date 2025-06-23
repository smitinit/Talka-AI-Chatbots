import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sha256 } from "js-sha256";
import { supabaseAdmin } from "@/db/supabase/supabase-admin";
import { getCachedApiKey, setCachedApiKey } from "@/lib/cache";

export const runtime = "nodejs";

/* ── helper to verify mesh token ──────────────────────────────── */
function verifyApiMeshToken(token: string) {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;

  const secret = process.env.API_MESH_SECRET;
  if (!secret) throw new Error("API_MESH_SECRET not set");

  // Re-create signature
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("hex");

  // timing-safe compare
  if (
    expected.length !== sig.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  )
    return null;

  // Decode payload: rawToken|bot_id|user_id|iat|exp
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

  /* 1 — Grab & verify mesh token */
  const authHeader =
    req.headers.get("x-bot-auth") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Missing API token", err_code: "TOKEN_MISSING" },
      { status: 401 }
    );
  }

  const parts = verifyApiMeshToken(authHeader);
  if (!parts) {
    return NextResponse.json(
      { error: "Invalid or expired token", err_code: "TOKEN_INVALID" },
      { status: 401 }
    );
  }

  const { rawToken, botId: botInToken } = parts;

  /* 2 — Param / payload mismatch guard */
  if (botInToken !== botParam || !rawToken) {
    return NextResponse.json(
      { error: "Bot mismatch", err_code: "BOT_MISMATCH" },
      { status: 403 }
    );
  }

  /* 3 — DB lookup, revocation, permissions and chaching*/
  const hash = sha256(rawToken);

  let keyRow = await getCachedApiKey(hash);
  // const foundInCache = !!keyRow;
  // console.log(foundInCache);
  if (!keyRow) {
    const { data, error } = await supabaseAdmin
      .from("api_keys")
      .select("api_id, permissions, name")
      .eq("bot_id", botParam)
      .eq("token_hash", hash)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { error: "Key revoked or not found", err_code: "KEY_REVOKED" },
        { status: 403 }
      );
    }

    keyRow = data;
    await setCachedApiKey(hash, keyRow);
  }

  /* 4 — OPTIONAL: enforce fine-grained permission */
  if (!keyRow.permissions.includes("read")) {
    return NextResponse.json(
      { error: "Missing permission", err_code: "PERMISSION_DENIED" },
      { status: 403 }
    );
  }

  console.log(
    `[Auth] Bot ${botParam} validated with ${keyRow.permissions.length} permissions`
  );

  return NextResponse.json({
    ok: true,
    bot_id: botParam,
    permissions: keyRow.permissions,
    msg: "API token validated ✅",
    apiName: keyRow.name,
  });
}

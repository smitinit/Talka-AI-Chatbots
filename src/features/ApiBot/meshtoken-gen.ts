"server only";

import crypto from "crypto";

export function generateApiMeshToken({
  token,
  bot_id,
  user_id,
  ttl = 7 * 24 * 60 * 60 * 1000,
}: {
  token: string;
  bot_id: string;
  user_id: string;
  ttl?: number;
}): string {
  const now = Date.now();
  const expiresAt = now + ttl;
  const payload = `${token}|${bot_id}|${user_id}|${now}|${expiresAt}`;

  // Node ≥18 supports "base64url"
  const base64Payload = Buffer.from(payload).toString("base64url");

  const secret = process.env.API_MESH_SECRET;
  if (!secret) throw new Error("API_MESH_SECRET env var is missing");

  const signature = crypto
    .createHmac("sha256", secret)
    .update(base64Payload)
    .digest("hex");

  return `${base64Payload}.${signature}`;
}

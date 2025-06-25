import { kv } from "@vercel/kv";
import lru, { BotProfile } from "./lru";

type ApiKeyCache = {
  api_id: string;
  permissions: string[];
  name: string;
};

export async function getCachedApiKey(
  hash: string
): Promise<ApiKeyCache | null> {
  const cacheKey = `apikey:${hash}`;

  if (process.env.NODE_ENV !== "production") {
    const cached = lru.get(cacheKey);
    return (cached as ApiKeyCache) ?? null;
  }

  const cached = await kv.get<ApiKeyCache>(cacheKey);
  return cached ?? null;
}

export async function setCachedApiKey(hash: string, data: ApiKeyCache) {
  const cacheKey = `apikey:${hash}`;

  if (process.env.NODE_ENV !== "production") {
    lru.set(cacheKey, data);
  } else {
    await kv.set(cacheKey, data, { ex: 60 * 5 }); // 5 min TTL
  }
}

export async function deleteCachedApiKey(hash: string) {
  const cacheKey = `apikey:${hash}`;

  if (process.env.NODE_ENV !== "production") {
    lru.delete(cacheKey);
  } else {
    await kv.del(cacheKey);
  }
}
const getCacheKey = (botId: string) => `bot_profile:${botId}`;
/* ── Get cached bot profile ───────────────────────────── */
export async function getCachedBotProfile(
  botId: string
): Promise<BotProfile | null> {
  const cacheKey = getCacheKey(botId);

  if (process.env.NODE_ENV !== "production") {
    const cached = lru.get(cacheKey);
    if (cached && isBotProfile(cached)) return cached;
    return null;
  }

  const cached = await kv.get<BotProfile>(cacheKey);
  return cached ?? null;
}

/* ── Set bot profile in cache ─────────────────────────── */
export async function setCachedBotProfile(botId: string, profile: BotProfile) {
  const cacheKey = getCacheKey(botId);

  if (process.env.NODE_ENV !== "production") {
    lru.set(cacheKey, profile);
  } else {
    await kv.set(cacheKey, profile, { ex: 60 * 5 }); // 5 min TTL
  }
}

/* ── Delete bot profile from cache ────────────────────── */
export async function deleteCachedBotProfile(botId: string) {
  const cacheKey = getCacheKey(botId);

  if (process.env.NODE_ENV !== "production") {
    lru.delete(cacheKey);
  } else {
    await kv.del(cacheKey);
  }
}

interface BotProfileLike {
  config: unknown;
  runtime_settings: unknown;
  settings: unknown;
  fetchedAt: string;
}

function isBotProfile(obj: unknown): obj is BotProfile {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "config" in obj &&
    "runtime_settings" in obj &&
    "settings" in obj &&
    typeof (obj as BotProfileLike).fetchedAt === "string"
  );
}

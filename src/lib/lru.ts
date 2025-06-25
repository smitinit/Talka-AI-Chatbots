import { BotConfigType } from "@/features/config/configSchema";
import { BotRuntimeSettingsType } from "@/features/runtime/runtimeSchema";
import { BotSettingsType } from "@/features/settings/settingsSchema";
import { LRUCache } from "lru-cache";

// ─────────────────────────────
// TYPES
// ─────────────────────────────
export type ApiKeyCache = {
  api_id: string;
  permissions: string[];
  name: string;
};

export type BotProfile = {
  config: BotConfigType;
  runtime_settings: BotRuntimeSettingsType;
  settings: BotSettingsType;
  fetchedAt: string;
};

// Extend if needed
type CacheValue = ApiKeyCache | BotProfile;

// ─────────────────────────────
// GLOBAL LRU HOLDER
// ─────────────────────────────
declare global {
  var __global_lru_cache__: LRUCache<string, CacheValue> | undefined;
}

const lru =
  global.__global_lru_cache__ ??
  new LRUCache<string, CacheValue>({
    max: 1000,
    ttl: 1000 * 60 * 5, // 5 minutes
  });

if (!global.__global_lru_cache__) {
  global.__global_lru_cache__ = lru;
}

export default lru;

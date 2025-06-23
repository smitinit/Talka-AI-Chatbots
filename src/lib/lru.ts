import { LRUCache } from "lru-cache";

type ApiKeyCache = {
  api_id: string;
  permissions: string[];
};

// Augment the Node.js global object to include your cache
declare global {
  var __global_lru_apikey_cache__: LRUCache<string, ApiKeyCache> | undefined;
}

const lru =
  global.__global_lru_apikey_cache__ ??
  new LRUCache<string, ApiKeyCache>({
    max: 1000,
    ttl: 1000 * 60 * 5, // 5 minutes
  });

if (!global.__global_lru_apikey_cache__) {
  global.__global_lru_apikey_cache__ = lru;
}

export default lru;

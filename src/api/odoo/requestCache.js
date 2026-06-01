/**
 * In-memory GET response cache + in-flight request deduplication.
 * Reduces duplicate Odoo calls during navigation and parallel mounts.
 */

const cache = new Map();
const inflight = new Map();

function stableSerialize(params = {}) {
  const keys = Object.keys(params).sort();
  return keys.map((k) => `${k}=${String(params[k])}`).join("&");
}

export function buildCacheKey(path, params = {}) {
  return `${path}?${stableSerialize(params)}`;
}

/** TTL (ms) for cacheable Odoo GET paths. 0 = never cache by default. */
export function defaultCacheTtl(path = "") {
  const p = String(path);
  if (
    p.includes("/api/order") ||
    p.includes("/api/order-line") ||
    p.includes("apply_loyalty") ||
    p.includes("/api/contacts") ||
    p.includes("loyalty-coupon") ||
    p.includes("loyalty-reward") ||
    p.includes("create_order") ||
    p.includes("remove_card")
  ) {
    return 0;
  }
  if (p.includes("payment-provider")) return 5 * 60 * 1000;
  if (p.includes("deal-day-slider") || p.includes("bcd-deal-day-slider")) {
    return 10 * 60 * 1000;
  }
  if (p.includes("bcd-website-category")) return 5 * 60 * 1000;
  if (p.includes("bcp-product-template")) return 2 * 60 * 1000;
  if (p.includes("country")) return 24 * 60 * 60 * 1000;
  if (p.includes("delivery-method")) return 5 * 60 * 1000;
  if (p.includes("config-settings")) return 10 * 60 * 1000;
  return 0;
}

export function invalidateCache(prefix = "") {
  const p = String(prefix);
  for (const key of cache.keys()) {
    if (!p || key.startsWith(p)) cache.delete(key);
  }
}

export function clearRequestCache() {
  cache.clear();
  inflight.clear();
}

/**
 * @param {() => Promise<unknown>} fetcher
 * @param {string} key
 * @param {number} ttlMs
 */
export async function cachedFetch(fetcher, key, ttlMs) {
  const now = Date.now();
  if (ttlMs > 0) {
    const hit = cache.get(key);
    if (hit && hit.expiresAt > now) {
      return hit.data;
    }
  }

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const promise = Promise.resolve()
    .then(fetcher)
    .then((data) => {
      if (ttlMs > 0) {
        cache.set(key, { data, expiresAt: now + ttlMs });
      }
      inflight.delete(key);
      return data;
    })
    .catch((err) => {
      inflight.delete(key);
      throw err;
    });

  inflight.set(key, promise);
  return promise;
}

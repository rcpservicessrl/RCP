type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;
const MAX_BUCKETS = 10_000;
const CLEANUP_INTERVAL_MS = 60_000;
let nextCleanupAt = 0;

const clientAddress = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").map((part) => part.trim()).filter(Boolean).at(-1);
  const real = request.headers.get("x-real-ip")?.trim();
  return forwarded || real || "unknown";
};

const digest = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

export async function consumeRateLimit(request: Request, scope: string) {
  const now = Date.now();
  const key = `${scope}:${await digest(clientAddress(request))}`;
  if (now >= nextCleanupAt) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
    nextCleanupAt = now + CLEANUP_INTERVAL_MS;
  }
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    // Bound memory without evicting active clients and resetting their limits.
    if (!current && buckets.size >= MAX_BUCKETS) {
      return { allowed: false, retryAfter: Math.max(1, Math.ceil((nextCleanupAt - now) / 1000)) };
    }
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

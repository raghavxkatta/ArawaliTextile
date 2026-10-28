import "server-only";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

/**
 * Simple sliding-window limit per IP, held in memory. On Vercel each warm
 * instance keeps its own map, which is enough to stop casual abuse of a
 * contact form. Swap for Upstash/Vercel KV if spam becomes a real problem.
 */
export function rateLimit(ip: string, now = Date.now()): { ok: boolean; retryAfter: number } {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return { ok: false, retryAfter: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  return { ok: true, retryAfter: 0 };
}

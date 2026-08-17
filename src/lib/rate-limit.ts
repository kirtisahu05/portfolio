// In-memory IP rate limiter for /api/ask.
//
// NOT production-accurate on multi-instance serverless deployments (Vercel):
// each cold start / instance gets its own Map, so a limit of N per hour is
// actually N per hour *per warm instance*, not globally. Fine as a cheap MVP
// guard against casual abuse on a low-traffic personal portfolio; upgrade to
// Upstash Redis (@upstash/ratelimit) for an accurate global limit if traffic
// grows or abuse becomes a real problem. Swapping later only touches this
// file — the route just calls checkRateLimit().

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const LIMIT = Number(process.env.AI_ASK_RATE_LIMIT) || 10;

const hits = new Map<string, number[]>();

// Periodically drop stale IPs so the Map doesn't grow unbounded for the
// lifetime of a warm instance.
function prune(now: number) {
  for (const [ip, timestamps] of hits) {
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);
    if (recent.length === 0) hits.delete(ip);
    else hits.set(ip, recent);
  }
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  if (Math.random() < 0.01) prune(now);

  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= LIMIT) {
    hits.set(ip, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  hits.set(ip, timestamps);
  return { allowed: true, remaining: LIMIT - timestamps.length };
}

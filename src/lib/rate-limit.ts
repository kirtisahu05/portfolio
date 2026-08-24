// In-memory IP rate limiter factory.
//
// NOT production-accurate on multi-instance serverless deployments (Vercel):
// each cold start / instance gets its own Map, so a limit of N per window is
// actually N per window *per warm instance*, not globally. Fine as a cheap
// MVP guard against casual abuse on a low-traffic personal portfolio;
// upgrade to Upstash Redis (@upstash/ratelimit) for an accurate global limit
// if traffic grows or abuse becomes a real problem.
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();

  // Periodically drop stale IPs so the Map doesn't grow unbounded for the
  // lifetime of a warm instance.
  function prune(now: number) {
    for (const [ip, timestamps] of hits) {
      const recent = timestamps.filter((t) => now - t < windowMs);
      if (recent.length === 0) hits.delete(ip);
      else hits.set(ip, recent);
    }
  }

  return function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    if (Math.random() < 0.01) prune(now);

    const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);

    if (timestamps.length >= limit) {
      hits.set(ip, timestamps);
      return { allowed: false, remaining: 0 };
    }

    timestamps.push(now);
    hits.set(ip, timestamps);
    return { allowed: true, remaining: limit - timestamps.length };
  };
}

const ONE_HOUR_MS = 60 * 60 * 1000;

export const checkRateLimit = createRateLimiter(Number(process.env.AI_ASK_RATE_LIMIT) || 10, ONE_HOUR_MS);

// Guards PIN-guessing on the Log contribute gate.
export const checkLogContributeRateLimit = createRateLimiter(
  Number(process.env.LOG_CONTRIBUTE_RATE_LIMIT) || 5,
  ONE_HOUR_MS
);

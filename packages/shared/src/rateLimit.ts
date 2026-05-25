export interface RateLimitState {
  count: number;
  resetAt: number;
}

export function nextRateLimitState(
  previous: RateLimitState | undefined,
  now: number,
  windowMs: number,
  maxRequests: number
) {
  if (!previous || now >= previous.resetAt) {
    return { allowed: true, state: { count: 1, resetAt: now + windowMs } };
  }

  const count = previous.count + 1;
  return {
    allowed: count <= maxRequests,
    state: { count, resetAt: previous.resetAt }
  };
}

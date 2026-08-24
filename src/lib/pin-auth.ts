import { timingSafeEqual } from "crypto";

// Constant-time compare so response timing can't be used to narrow down the
// PIN digit-by-digit. timingSafeEqual throws on mismatched buffer lengths
// rather than just returning false, so that case is handled explicitly.
export function pinMatches(submitted: string, expected: string): boolean {
  const a = Buffer.from(submitted);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

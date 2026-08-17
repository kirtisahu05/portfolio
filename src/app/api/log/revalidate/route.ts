import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { LOG_CACHE_TAG } from "@/lib/log-source";

// Manual escape hatch for the Log tab's cache (see LOG_REVALIDATE_SECONDS in
// log-source.ts) — hit this right after editing the Sheet instead of waiting
// out the revalidation window. Requires LOG_REVALIDATE_SECRET so randoms
// can't force-refetch on demand; unset means the endpoint stays disabled.
export async function GET(request: NextRequest) {
  const secret = process.env.LOG_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: "not_configured" }, { status: 501 });
  }

  if (request.nextUrl.searchParams.get("secret") !== secret) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  // { expire: 0 } forces immediate expiration rather than the default
  // stale-while-revalidate profile — this endpoint exists specifically so a
  // manual trigger gets fresh data on the very next request, not the one after.
  revalidateTag(LOG_CACHE_TAG, { expire: 0 });
  return Response.json({ revalidated: true, now: Date.now() });
}

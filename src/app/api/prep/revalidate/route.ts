import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { PREP_CACHE_TAG } from "@/lib/prep-source";

// Manual escape hatch for the Prep tab's cache (see PREP_REVALIDATE_SECONDS in
// prep-source.ts) — hit this right after editing the Sheet instead of waiting
// out the revalidation window. Requires PREP_REVALIDATE_SECRET so randoms
// can't force-refetch on demand; unset means the endpoint stays disabled.
export async function GET(request: NextRequest) {
  const secret = process.env.PREP_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: "not_configured" }, { status: 501 });
  }

  if (request.nextUrl.searchParams.get("secret") !== secret) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  revalidateTag(PREP_CACHE_TAG, { expire: 0 });
  return Response.json({ revalidated: true, now: Date.now() });
}

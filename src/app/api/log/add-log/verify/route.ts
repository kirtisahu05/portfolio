import type { NextRequest } from "next/server";
import { checkLogContributeRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { pinMatches } from "@/lib/pin-auth";

export async function POST(request: NextRequest) {
  const expectedPin = process.env.LOG_CONTRIBUTE_PIN;
  if (!expectedPin) {
    return Response.json({ error: "not_configured" }, { status: 501 });
  }

  const ip = getClientIp(request);
  const { allowed } = checkLogContributeRateLimit(ip);
  if (!allowed) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { pin?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const pin = typeof body.pin === "string" ? body.pin.trim() : "";
  if (!pin || !pinMatches(pin, expectedPin)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  return Response.json({ ok: true });
}

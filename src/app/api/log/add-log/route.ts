import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { checkLogContributeRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { pinMatches } from "@/lib/pin-auth";
import { DATE_RE, TIME_RE, LOG_CACHE_TAG, getLogSheetId } from "@/lib/log-source";
import { appendSheetRow } from "@/lib/google-sheets";

type Body = {
  pin?: unknown;
  title?: unknown;
  date?: unknown;
  time?: unknown;
  type?: unknown;
  category?: unknown;
  summary?: unknown;
  content?: unknown;
  externalUrl?: unknown;
  imageUrl?: unknown;
  tags?: unknown;
  status?: unknown;
  visibility?: unknown;
};

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(request: NextRequest) {
  const expectedPin = process.env.LOG_CONTRIBUTE_PIN;
  if (!expectedPin) {
    return Response.json({ error: "not_configured", message: "Add Log form isn't configured yet." }, { status: 501 });
  }

  const ip = getClientIp(request);
  const { allowed } = checkLogContributeRateLimit(ip);
  if (!allowed) {
    return Response.json({ error: "rate_limited", message: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request", message: "Something went wrong. Please try again." }, { status: 400 });
  }

  const pin = str(body.pin);
  if (!pin || !pinMatches(pin, expectedPin)) {
    return Response.json({ error: "unauthorized", message: "Incorrect PIN." }, { status: 401 });
  }

  const title = str(body.title);
  const date = str(body.date);
  const time = str(body.time);
  const type = str(body.type);
  const category = str(body.category);
  const summary = str(body.summary);
  const content = str(body.content);
  const externalUrl = str(body.externalUrl);
  const imageUrl = str(body.imageUrl);
  const tags = str(body.tags);
  const status = str(body.status);
  const visibility = str(body.visibility) || "Public";

  // Same required-field contract log-source.ts enforces on read, checked
  // here too so a bad submission never reaches the sheet in the first place.
  if (!title || !date || !type || !category || !summary || !status) {
    return Response.json(
      { error: "bad_request", message: "Title, Date, Type, Category, Summary, and Status are required." },
      { status: 400 }
    );
  }
  if (status !== "Published" && status !== "Draft") {
    return Response.json({ error: "bad_request", message: 'Status must be "Published" or "Draft".' }, { status: 400 });
  }
  if (visibility !== "Public" && visibility !== "Private") {
    return Response.json({ error: "bad_request", message: 'Visibility must be "Public" or "Private".' }, { status: 400 });
  }
  if (!DATE_RE.test(date)) {
    return Response.json({ error: "bad_request", message: "Date must be plain text in YYYY-MM-DD format." }, { status: 400 });
  }
  if (time && !TIME_RE.test(time)) {
    return Response.json({ error: "bad_request", message: "Time must be plain text in 24-hour HH:MM format." }, { status: 400 });
  }
  if (!content && !externalUrl) {
    return Response.json(
      { error: "bad_request", message: "Provide either Content or an External URL." },
      { status: 400 }
    );
  }

  const spreadsheetId = getLogSheetId();
  if (!spreadsheetId) {
    return Response.json({ error: "not_configured", message: "Sheet isn't configured yet." }, { status: 501 });
  }
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    return Response.json(
      { error: "not_configured", message: "Writing to the sheet isn't configured yet." },
      { status: 501 }
    );
  }

  try {
    await appendSheetRow(spreadsheetId, {
      Title: title,
      Date: date,
      Time: time,
      Type: type,
      Category: category,
      Summary: summary,
      Content: content,
      ExternalUrl: externalUrl,
      ImageUrl: imageUrl,
      Tags: tags,
      Status: status,
      Visibility: visibility,
    });
  } catch (err) {
    console.error("[/api/log/add-log] Sheets append failed:", err);
    return Response.json(
      { error: "server_error", message: "Couldn't save that to the sheet. Please try again." },
      { status: 500 }
    );
  }

  // So the new entry shows up on /log immediately instead of waiting out
  // LOG_REVALIDATE_SECONDS.
  revalidateTag(LOG_CACHE_TAG, { expire: 0 });

  return Response.json({ ok: true });
}

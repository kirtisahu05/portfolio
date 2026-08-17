import Papa from "papaparse";

export type LogEntry = {
  slug: string;
  logNumber: number;
  title: string;
  date: string; // ISO 8601, e.g. "2026-08-16"
  time: string | null; // "16:30" or null
  type: string;
  category: string;
  summary: string;
  content: string | null;
  externalUrl: string | null;
  imageUrl: string | null;
  tags: string[];
  status: "Published" | "Draft";
  visibility: "Public";
};

// The ONLY shape ever produced for a Visibility=Private row. No summary,
// content, category, tags, image, external URL, or slug — a private entry
// gets no /log/[slug] route, so there's no slug for a visitor to guess an
// entry page from in the first place. Stripping happens once, server-side,
// in fetchAndParse below, immediately after the full row is parsed — the
// full data for a private row is discarded there and never threaded into
// any prop, page JSON, or client component. Just skipping the render for
// private content client-side wouldn't be real privacy: it'd still sit in
// the page's props/JSON, visible via view-source or the network tab.
export type PrivateLogEntry = {
  logNumber: number;
  title: string;
  date: string;
  visibility: "Private";
};

export type ListEntry = LogEntry | PrivateLogEntry;

export function isPrivateEntry(entry: ListEntry): entry is PrivateLogEntry {
  return entry.visibility === "Private";
}

const CSV_URL = process.env.LOG_SHEET_CSV_URL;
const REVALIDATE_SECONDS = Number(process.env.LOG_REVALIDATE_SECONDS) || 900;

// Lets /api/log/revalidate force-refetch just this data with revalidateTag,
// instead of waiting out REVALIDATE_SECONDS.
export const LOG_CACHE_TAG = "log-entries";

// In-memory fallback for when the sheet fetch fails outright (network error,
// sheet unpublished, Google outage) — separate from Next's own fetch cache,
// which only helps when the fetch actually succeeds. Same MVP caveat as
// rate-limit.ts: per-warm-instance only, resets on cold start. On a cold
// start with no prior success, callers just see the empty state, which is
// still a graceful degradation, not a crash.
let lastGoodEntries: ListEntry[] = [];

// Sheets' CSV export renders a cell's *display* format, which is locale- and
// column-format-dependent unless the column is plain text. Column is required
// to be literal "YYYY-MM-DD" text (see the Log PRD §7) — this only accepts
// that exact shape and treats anything else as unparseable.
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^(\d{2}):(\d{2})$/;

function parseDateParts(dateStr: string): { y: number; m: number; d: number } | null {
  const match = DATE_RE.exec(dateStr.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return { y, m, d };
}

function parseTimeParts(timeStr: string): { h: number; min: number } | null {
  const match = TIME_RE.exec(timeStr.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const min = Number(match[2]);
  if (h > 23 || min > 59) return null;
  return { h, min };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

type RawRow = Record<string, string>;
type ParsedRow = Omit<LogEntry, "slug" | "logNumber" | "visibility"> & {
  visibility: "Public" | "Private";
  sortTime: number;
};

function parseRow(row: RawRow, rowIndex: number): ParsedRow | null {
  const title = (row.Title ?? "").trim();
  const dateRaw = (row.Date ?? "").trim();
  const type = (row.Type ?? "").trim();
  const category = (row.Category ?? "").trim();
  const summary = (row.Summary ?? "").trim();
  const content = (row.Content ?? "").trim();
  const externalUrl = (row.ExternalUrl ?? "").trim();
  const statusRaw = (row.Status ?? "").trim();
  // Defaults to Public if the column is blank or missing entirely — keeps
  // existing sheets working unchanged until a Visibility column is added.
  const visibility: "Public" | "Private" =
    (row.Visibility ?? "").trim().toLowerCase() === "private" ? "Private" : "Public";

  if (!title || !dateRaw || !type || !category || !summary || !statusRaw) {
    console.warn(`[log-source] Skipping row ${rowIndex}: missing a required field.`);
    return null;
  }

  const status = statusRaw === "Published" || statusRaw === "Draft" ? statusRaw : null;
  if (!status) {
    console.warn(`[log-source] Skipping row ${rowIndex} ("${title}"): Status must be "Published" or "Draft".`);
    return null;
  }

  const dateParts = parseDateParts(dateRaw);
  if (!dateParts) {
    console.warn(
      `[log-source] Skipping row ${rowIndex} ("${title}"): unparseable Date "${dateRaw}" — expected plain-text YYYY-MM-DD.`
    );
    return null;
  }

  const timeRaw = (row.Time ?? "").trim();
  let hour = 0;
  let minute = 0;
  let time: string | null = null;
  if (timeRaw) {
    const timeParts = parseTimeParts(timeRaw);
    if (!timeParts) {
      console.warn(`[log-source] Row ${rowIndex} ("${title}"): unparseable Time "${timeRaw}" — ignoring time.`);
    } else {
      hour = timeParts.h;
      minute = timeParts.min;
      time = timeRaw;
    }
  }

  if (!content && !externalUrl) {
    console.warn(`[log-source] Skipping row ${rowIndex} ("${title}"): needs either Content or ExternalUrl.`);
    return null;
  }

  const { y, m, d } = dateParts;
  const sortTime = new Date(y, m - 1, d, hour, minute).getTime();
  const isoDate = `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return {
    title,
    date: isoDate,
    time,
    type,
    category,
    summary,
    content: content || null,
    externalUrl: externalUrl || null,
    imageUrl: (row.ImageUrl ?? "").trim() || null,
    tags: splitTags(row.Tags ?? ""),
    status,
    visibility,
    sortTime,
  };
}

async function fetchAndParse(): Promise<ListEntry[]> {
  if (!CSV_URL) return [];

  const res = await fetch(CSV_URL, {
    next: { revalidate: REVALIDATE_SECONDS, tags: [LOG_CACHE_TAG] },
  });
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status} ${res.statusText}`);

  const csv = await res.text();
  const parsed = Papa.parse<RawRow>(csv, { header: true, skipEmptyLines: true });

  const withSortTime = parsed.data
    .map((row, i) => parseRow(row, i + 2)) // +2: header row + 1-indexing
    .filter((row): row is ParsedRow => row !== null)
    .filter((row) => row.status === "Published")
    .sort((a, b) => a.sortTime - b.sortTime); // oldest first, so log numbers ascend correctly

  const slugCounts = new Map<string, number>();
  const entries: ListEntry[] = withSortTime.map((row, i) => {
    const logNumber = i + 1;

    // Private rows are stripped down here, before anything downstream ever
    // sees them — the full row (content, summary, category, tags, image,
    // external URL) is discarded in this scope and never returned.
    if (row.visibility === "Private") {
      const privateEntry: PrivateLogEntry = {
        logNumber,
        title: row.title,
        date: row.date,
        visibility: "Private",
      };
      return privateEntry;
    }

    const { sortTime, visibility, ...rest } = row;
    void sortTime;
    const base = slugify(rest.title);
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${count + 1}`;
    const publicEntry: LogEntry = { ...rest, slug, logNumber, visibility };
    return publicEntry;
  });

  return entries.reverse(); // newest first for display
}

export async function getLogEntries(): Promise<ListEntry[]> {
  try {
    const entries = await fetchAndParse();
    if (entries.length > 0 || !CSV_URL) lastGoodEntries = entries;
    return entries.length > 0 ? entries : lastGoodEntries;
  } catch (err) {
    console.error("[log-source] Failed to fetch/parse the log sheet:", err);
    return lastGoodEntries;
  }
}

export async function getLogEntryBySlug(slug: string): Promise<LogEntry | null> {
  const entries = await getLogEntries();
  // Private entries carry no `slug` and are excluded here, not just
  // unlinked — a guessed/cached/previously-shared URL for one 404s the same
  // as any nonexistent slug, rather than confirming the entry exists.
  return entries.find((e): e is LogEntry => e.visibility === "Public" && e.slug === slug) ?? null;
}

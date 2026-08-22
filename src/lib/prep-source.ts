import Papa from "papaparse";
import { PREP_TABS, type PrepTab } from "@/lib/prep-tabs";

export type PrepEntry = {
  slug: string;
  topicNumber: number;
  title: string;
  date: string; // ISO 8601, e.g. "2026-08-16" — sourced from the sheet's "Last Updated On" column
  category: string;
  content: string;
  interviewTakeaway: string | null;
  externalUrl: string | null;
  imageUrl: string | null;
  tags: string[];
  status: "Published" | "Draft";
  tabSlug: string;
  tabLabel: string;
};

// Base CSV export URL, without a `gid` — each configured tab in prep-tabs.ts
// appends its own `&gid=<id>` to this at fetch time.
const CSV_BASE_URL = process.env.PREP_SHEET_CSV_URL;
const REVALIDATE_SECONDS = Number(process.env.PREP_REVALIDATE_SECONDS) || 900;

export const PREP_CACHE_TAG = "prep-entries";

let lastGoodEntries: PrepEntry[] = [];

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

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
type ParsedRow = Omit<PrepEntry, "slug" | "topicNumber"> & { sortTime: number };

function parseRow(row: RawRow, tab: PrepTab, rowIndex: number): ParsedRow | null {
  const title = (row.Title ?? "").trim();
  const dateRaw = (row["Last Updated On"] ?? "").trim();
  const statusRaw = (row.Status ?? "").trim();
  const category = (row.Category ?? "").trim();
  const content = (row.Content ?? "").trim();
  const interviewTakeaway = (row["Interview takeaway"] ?? "").trim();
  const externalUrl = (row.ExternalUrl ?? "").trim();
  const imageUrl = (row.ImageUrl ?? "").trim();
  const tags = splitTags(row.Tags ?? "");

  if (!title || !dateRaw || !statusRaw || !category) {
    console.warn(`[prep-source] Skipping ${tab.label} row ${rowIndex}: missing a required field.`);
    return null;
  }

  const status = statusRaw === "Published" || statusRaw === "Draft" ? statusRaw : null;
  if (!status) {
    console.warn(
      `[prep-source] Skipping ${tab.label} row ${rowIndex} ("${title}"): Status must be "Published" or "Draft".`
    );
    return null;
  }

  const dateParts = parseDateParts(dateRaw);
  if (!dateParts) {
    console.warn(
      `[prep-source] Skipping ${tab.label} row ${rowIndex} ("${title}"): unparseable "Last Updated On" date "${dateRaw}" — expected plain-text YYYY-MM-DD.`
    );
    return null;
  }

  if (!content && !externalUrl) {
    console.warn(`[prep-source] Skipping ${tab.label} row ${rowIndex} ("${title}"): needs either Content or ExternalUrl.`);
    return null;
  }

  const { y, m, d } = dateParts;
  const sortTime = new Date(y, m - 1, d).getTime();
  const isoDate = `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return {
    title,
    date: isoDate,
    category,
    content,
    interviewTakeaway: interviewTakeaway || null,
    externalUrl: externalUrl || null,
    imageUrl: imageUrl || null,
    tags,
    status,
    tabSlug: tab.slug,
    tabLabel: tab.label,
    sortTime,
  };
}

async function fetchTab(tab: PrepTab): Promise<ParsedRow[]> {
  if (!CSV_BASE_URL) return [];

  const res = await fetch(`${CSV_BASE_URL}&gid=${tab.gid}`, {
    next: { revalidate: REVALIDATE_SECONDS, tags: [PREP_CACHE_TAG] },
  });
  if (!res.ok) throw new Error(`Sheet fetch failed for tab "${tab.label}": ${res.status} ${res.statusText}`);

  const csv = await res.text();
  const parsed = Papa.parse<RawRow>(csv, { header: true, skipEmptyLines: true });

  return parsed.data
    .map((row, i) => parseRow(row, tab, i + 2)) // +2: header row + 1-indexing
    .filter((row): row is ParsedRow => row !== null)
    .filter((row) => row.status === "Published");
}

async function fetchAndParse(): Promise<PrepEntry[]> {
  if (!CSV_BASE_URL) return [];

  // One tab failing to fetch/parse shouldn't take every other tab down with
  // it — each tab is fetched independently and a failure just drops that
  // tab's entries for this pass (falling back to lastGoodEntries covers it).
  const results = await Promise.allSettled(PREP_TABS.map(fetchTab));
  const withSortTime: ParsedRow[] = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      withSortTime.push(...result.value);
    } else {
      console.error(`[prep-source] Failed to fetch/parse tab "${PREP_TABS[i].label}":`, result.reason);
    }
  });

  withSortTime.sort((a, b) => a.sortTime - b.sortTime); // oldest first, so topic numbers ascend correctly

  const slugCounts = new Map<string, number>();
  const entries: PrepEntry[] = withSortTime.map((row, i) => {
    const topicNumber = i + 1;
    const { sortTime, ...rest } = row;
    void sortTime;
    const base = slugify(rest.title);
    const count = slugCounts.get(base) ?? 0;
    slugCounts.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${count + 1}`;
    return { ...rest, slug, topicNumber };
  });

  return entries.reverse(); // newest first for display
}

export async function getPrepEntries(): Promise<PrepEntry[]> {
  try {
    const entries = await fetchAndParse();
    if (entries.length > 0 || !CSV_BASE_URL) lastGoodEntries = entries;
    return entries.length > 0 ? entries : lastGoodEntries;
  } catch (err) {
    console.error("[prep-source] Failed to fetch/parse the prep sheet:", err);
    return lastGoodEntries;
  }
}

export async function getPrepEntryBySlug(slug: string): Promise<PrepEntry | null> {
  const entries = await getPrepEntries();
  return entries.find((e) => e.slug === slug) ?? null;
}

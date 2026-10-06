// Shared rules for a Log entry — used by the Add Log form (client), the
// add-log API route (server), and log-source.ts when it reads rows back.
// Keeping one copy means a submission the form accepts is one the API
// accepts and one /log actually renders, instead of saving fine and then
// being silently skipped on read.

export const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
export const TIME_RE = /^(\d{2}):(\d{2})$/;

// Google Sheets caps a cell at 50,000 characters; content stays under that.
export const LOG_LIMITS = {
  title: 200,
  type: 40,
  category: 40,
  summary: 500,
  content: 45000,
  url: 2000,
  tags: 300,
} as const;

/** Real calendar date in YYYY-MM-DD (rejects e.g. 2026-02-31), or null. */
export function parseDateParts(dateStr: string): { y: number; m: number; d: number } | null {
  const match = DATE_RE.exec(dateStr.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return { y, m, d };
}

/** 24-hour HH:MM with a real hour/minute, or null. */
export function parseTimeParts(timeStr: string): { h: number; min: number } | null {
  const match = TIME_RE.exec(timeStr.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const min = Number(match[2]);
  if (h > 23 || min > 59) return null;
  return { h, min };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Only http(s) links — these end up in <a href> / <img src> on /log. */
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export type LogInput = {
  title: string;
  date: string;
  time: string;
  type: string;
  category: string;
  summary: string;
  content: string;
  externalUrl: string;
  imageUrl: string;
  tags: string;
  status: string;
  visibility: string;
};

/** First problem with an entry as a user-facing message, or null if it's valid. Expects trimmed values. */
export function validateLogInput(i: LogInput): string | null {
  if (!i.title || !i.date || !i.type || !i.category || !i.summary || !i.status) {
    return "Title, Date, Type, Category, Summary, and Status are required.";
  }
  if (!slugify(i.title)) {
    return "Title needs at least one English letter or number — it's used to build the entry's URL.";
  }
  if (i.status !== "Published" && i.status !== "Draft") return 'Status must be "Published" or "Draft".';
  if (i.visibility !== "Public" && i.visibility !== "Private") return 'Visibility must be "Public" or "Private".';
  if (!parseDateParts(i.date)) return "Date must be a real date in YYYY-MM-DD format.";
  if (i.time && !parseTimeParts(i.time)) return "Time must be a real 24-hour time in HH:MM format.";
  if (!i.content && !i.externalUrl) return "Provide either Content or an External URL.";
  if (i.externalUrl && !isHttpUrl(i.externalUrl)) return "External URL must start with http:// or https://.";
  if (i.imageUrl && !isHttpUrl(i.imageUrl)) return "Image URL must start with http:// or https://.";

  const tooLong: [keyof typeof LOG_LIMITS, string, string][] = [
    ["title", "Title", i.title],
    ["type", "Type", i.type],
    ["category", "Category", i.category],
    ["summary", "Summary", i.summary],
    ["content", "Content", i.content],
    ["url", "External URL", i.externalUrl],
    ["url", "Image URL", i.imageUrl],
    ["tags", "Tags", i.tags],
  ];
  for (const [key, label, value] of tooLong) {
    if (value.length > LOG_LIMITS[key]) {
      return `${label} is too long (max ${LOG_LIMITS[key].toLocaleString("en-US")} characters).`;
    }
  }
  return null;
}

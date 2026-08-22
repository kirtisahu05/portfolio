"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { profile } from "@/lib/content";
import type { PrepEntry } from "@/lib/prep-source";
import { toPlainSnippet } from "@/lib/markdown-snippet";
import type { LogViewMode } from "@/components/Log/ViewSwitcher";

function formatDate(dateIso: string): string {
  const [y, m, d] = dateIso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PrepCard({
  entry,
  isLatest,
  view = "list",
}: {
  entry: PrepEntry;
  isLatest: boolean;
  view?: LogViewMode;
}) {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  const href = entry.content ? `/prep/${entry.slug}` : entry.externalUrl ?? "#";
  const isExternal = !entry.content && !!entry.externalUrl;
  const snippet = toPlainSnippet(entry.content);

  const topicLabel = `${isSignal ? "topic·" : "TOPIC·"}${String(entry.topicNumber).padStart(3, "0")} · ${entry.tabLabel}`;
  const externalMark = isExternal && (
    <span className="ml-1.5 align-middle text-xs" style={{ color: "var(--text-muted)" }}>
      ↗
    </span>
  );
  const categoryPill = (
    <span
      className="shrink-0 rounded-full px-2 py-0.5 font-[var(--font-mono)] text-[11px]"
      style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
    >
      {entry.category}
    </span>
  );
  const latestPill = isLatest && (
    <span
      className="rounded-full px-2 py-0.5 font-semibold"
      style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
    >
      LATEST
    </span>
  );

  let inner: ReactNode;

  if (view === "compact") {
    inner = (
      <div
        className="flex items-center gap-3 border-b px-1 py-2.5 transition-colors hover:bg-[var(--bg-elevated)]"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="w-20 shrink-0 whitespace-nowrap font-[var(--font-mono)] text-[11px]" style={{ color: "var(--text-muted)" }}>
          {formatDate(entry.date)}
        </span>
        <span className="entry-title-compact min-w-0 flex-1 truncate text-sm font-medium text-[var(--text-primary)]">
          {entry.title}
          {externalMark}
        </span>
        {categoryPill}
      </div>
    );
  } else if (view === "magazine") {
    inner = (
      <div
        className="overflow-hidden rounded-lg border transition-colors hover:border-[var(--border-strong)]"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        {entry.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- external, unknown-dimension sheet-supplied URLs
          <img src={entry.imageUrl} alt="" className="h-64 w-full object-cover sm:h-80" />
        )}
        <div className="p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2 font-[var(--font-mono)] text-[11px]">
            <span style={{ color: "var(--text-muted)" }}>{topicLabel}</span>
            {latestPill}
            {categoryPill}
          </div>
          <h3 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--text-primary)]">
            {entry.title}
            {externalMark}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{snippet}</p>
          <p className="mt-3 font-[var(--font-mono)] text-[11px]" style={{ color: "var(--text-muted)" }}>
            {profile.name} · {formatDate(entry.date)}
          </p>
        </div>
      </div>
    );
  } else if (view === "grid") {
    inner = (
      <div
        className="flex h-full flex-col overflow-hidden rounded-lg border transition-colors hover:border-[var(--border-strong)]"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        {entry.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external, unknown-dimension sheet-supplied URLs
          <img src={entry.imageUrl} alt="" className="h-36 w-full object-cover" />
        ) : (
          <div className="h-36 w-full" style={{ background: "var(--border)" }} />
        )}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 font-[var(--font-display)] text-sm font-semibold text-[var(--text-primary)]">
            {entry.title}
            {externalMark}
          </h3>
          <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--text-secondary)]">
            {snippet}
          </p>
          <div
            className="mt-3 flex items-center justify-between font-[var(--font-mono)] text-[11px]"
            style={{ color: "var(--text-muted)" }}
          >
            <span>{formatDate(entry.date)}</span>
            {categoryPill}
          </div>
        </div>
      </div>
    );
  } else {
    inner = (
      <div
        className="flex gap-4 rounded-lg border p-5 transition-colors hover:border-[var(--border-strong)]"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        {entry.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- external, unknown-dimension sheet-supplied URLs
          <img
            src={entry.imageUrl}
            alt=""
            className="h-20 w-20 shrink-0 rounded-md object-cover sm:h-24 sm:w-24"
            style={{ border: "1px solid var(--border)" }}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2 font-[var(--font-mono)] text-[11px]">
            <span style={{ color: "var(--text-muted)" }}>{topicLabel}</span>
            {latestPill}
            {categoryPill}
          </div>
          <h3 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
            {entry.title}
            {externalMark}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">{snippet}</p>
          <div
            className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-[var(--font-mono)] text-[11px]"
            style={{ color: "var(--text-muted)" }}
          >
            <span>{formatDate(entry.date)}</span>
            {entry.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const linkClassName = view === "grid" ? "block h-full" : "block";

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClassName}>
      {inner}
    </Link>
  );
}

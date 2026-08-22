"use client";

import type { PrepTab } from "@/lib/prep-tabs";

export default function PrepTabSwitcher({
  tabs,
  active,
  onChange,
}: {
  tabs: PrepTab[];
  active: string | null;
  onChange: (slug: string | null) => void;
}) {
  if (tabs.length === 0) return null;

  return (
    <div
      className="flex items-center gap-1 overflow-x-auto rounded-md border p-1"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      role="tablist"
      aria-label="Prep tabs"
    >
      <button
        type="button"
        role="tab"
        aria-selected={active === null}
        onClick={() => onChange(null)}
        className="shrink-0 whitespace-nowrap rounded px-3 py-1.5 font-[var(--font-mono)] text-[12px] transition-colors"
        style={
          active === null
            ? { background: "var(--text-primary)", color: "var(--bg)" }
            : { color: "var(--text-secondary)" }
        }
      >
        All
      </button>
      {tabs.map((tab) => (
        <button
          key={tab.slug}
          type="button"
          role="tab"
          aria-selected={active === tab.slug}
          onClick={() => onChange(tab.slug)}
          className="shrink-0 whitespace-nowrap rounded px-3 py-1.5 font-[var(--font-mono)] text-[12px] transition-colors"
          style={
            active === tab.slug
              ? { background: "var(--text-primary)", color: "var(--bg)" }
              : { color: "var(--text-secondary)" }
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

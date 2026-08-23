"use client";

export type PrepSortMode = "newest" | "oldest" | "title";

const OPTIONS: { value: PrepSortMode; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title (A–Z)" },
];

export default function PrepSort({
  value,
  onChange,
}: {
  value: PrepSortMode;
  onChange: (value: PrepSortMode) => void;
}) {
  return (
    <label className="flex items-center gap-2 font-[var(--font-mono)] text-[11px]" style={{ color: "var(--text-muted)" }}>
      sort:
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PrepSortMode)}
        aria-label="Sort topics"
        className="rounded-md border px-2 py-1.5 text-[12px] outline-none"
        style={{
          borderColor: "var(--border-strong)",
          background: "var(--bg-elevated)",
          color: "var(--text-secondary)",
        }}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

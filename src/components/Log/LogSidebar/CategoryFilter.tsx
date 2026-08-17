"use client";

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string | null;
  onChange: (category: string | null) => void;
}) {
  return (
    <div className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
      <p className="mb-3 font-[var(--font-mono)] text-[11px] tracking-wide" style={{ color: "var(--accent)" }}>
        categories
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          className="rounded-full px-3 py-1.5 text-[13px] transition-colors"
          style={
            active === null
              ? { background: "var(--text-primary)", color: "var(--bg)" }
              : { border: "1px solid var(--border)", color: "var(--text-secondary)" }
          }
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className="rounded-full px-3 py-1.5 text-[13px] transition-colors"
            style={
              active === cat
                ? { background: "var(--text-primary)", color: "var(--bg)" }
                : { border: "1px solid var(--border)", color: "var(--text-secondary)" }
            }
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

export default function LogFilter({
  types,
  active,
  onChange,
}: {
  types: string[];
  active: string | null;
  onChange: (type: string | null) => void;
}) {
  if (types.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-[var(--font-mono)] text-[11px]" style={{ color: "var(--text-muted)" }}>
        type:
      </span>
      <button
        type="button"
        onClick={() => onChange(null)}
        className="rounded-full px-3 py-1 font-[var(--font-mono)] text-[11px] transition-colors"
        style={
          active === null
            ? { background: "var(--text-primary)", color: "var(--bg)" }
            : { border: "1px solid var(--border)", color: "var(--text-secondary)" }
        }
      >
        All
      </button>
      {types.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className="rounded-full px-3 py-1 font-[var(--font-mono)] text-[11px] transition-colors"
          style={
            active === type
              ? { background: "var(--text-primary)", color: "var(--bg)" }
              : { border: "1px solid var(--border)", color: "var(--text-secondary)" }
          }
        >
          {type}
        </button>
      ))}
    </div>
  );
}

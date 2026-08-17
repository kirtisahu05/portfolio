"use client";

export type LogViewMode = "list" | "compact" | "magazine" | "grid";

const VIEWS: { id: LogViewMode; label: string }[] = [
  { id: "list", label: "List view" },
  { id: "compact", label: "Compact view" },
  { id: "magazine", label: "Magazine view" },
  { id: "grid", label: "Grid view" },
];

function ListIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="2" y="2.75" width="3" height="3" rx="0.6" fill="currentColor" />
      <path d="M7 4.25H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="2" y="9.75" width="3" height="3" rx="0.6" fill="currentColor" />
      <path d="M7 11.25H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CompactIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M2 3H14M2 6.33H14M2 9.67H14M2 13H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function MagazineIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="2" y="2.5" width="12" height="11" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6.5H14" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

const ICONS: Record<LogViewMode, () => React.ReactElement> = {
  list: ListIcon,
  compact: CompactIcon,
  magazine: MagazineIcon,
  grid: GridIcon,
};

export default function ViewSwitcher({
  view,
  onChange,
}: {
  view: LogViewMode;
  onChange: (view: LogViewMode) => void;
}) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-md border p-1"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      role="group"
      aria-label="Log view mode"
    >
      {VIEWS.map(({ id, label }) => {
        const Icon = ICONS[id];
        const active = view === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className="flex h-7 w-7 items-center justify-center rounded transition-colors"
            style={
              active
                ? { background: "var(--text-primary)", color: "var(--bg)" }
                : { color: "var(--text-muted)" }
            }
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}

export default function StatsCard({ postCount, categoryCount }: { postCount: number; categoryCount: number }) {
  return (
    <div className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
      <p className="mb-3 font-[var(--font-mono)] text-[11px] tracking-wide" style={{ color: "var(--accent)" }}>
        stats
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="font-[var(--font-display)] text-2xl font-semibold text-[var(--text-primary)]">
            {postCount}
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">{postCount === 1 ? "entry" : "entries"}</p>
        </div>
        <div>
          <p className="font-[var(--font-display)] text-2xl font-semibold text-[var(--text-primary)]">
            {categoryCount}
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">{categoryCount === 1 ? "category" : "categories"}</p>
        </div>
      </div>
    </div>
  );
}

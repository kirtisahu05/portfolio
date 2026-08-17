"use client";

export default function LogPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-md border px-4 py-2 text-sm disabled:opacity-40"
        style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}
      >
        Previous
      </button>
      <span className="font-[var(--font-mono)] text-xs" style={{ color: "var(--text-muted)" }}>
        page {page} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-md border px-4 py-2 text-sm disabled:opacity-40"
        style={{ borderColor: "var(--border-strong)", color: "var(--text-secondary)" }}
      >
        Next
      </button>
    </div>
  );
}

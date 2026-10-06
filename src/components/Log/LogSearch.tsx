"use client";

export default function LogSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search entries..."
      aria-label="Search log entries"
      className="w-full rounded-[var(--btn-radius)] border px-5 py-2.5 text-sm outline-none"
      style={{
        borderColor: "var(--border-strong)",
        background: "var(--bg-elevated)",
        color: "var(--text-primary)",
      }}
    />
  );
}

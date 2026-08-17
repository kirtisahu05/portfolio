"use client";

import { useTheme } from "@/lib/theme-context";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Switch design theme"
      className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-[var(--font-mono)]"
    >
      <span className={`hidden sm:inline ${theme === "a" ? "text-[var(--accent)]" : ""}`}>
        systems
      </span>
      <span
        className="relative inline-flex h-4 w-8 shrink-0 items-center rounded-full border border-[var(--border-strong)]"
        aria-hidden="true"
      >
        <span
          className="inline-block h-3 w-3 rounded-full bg-[var(--accent)] transition-transform"
          style={{ transform: theme === "b" ? "translateX(16px)" : "translateX(2px)" }}
        />
      </span>
      <span className={`hidden sm:inline ${theme === "b" ? "text-[var(--accent)]" : ""}`}>
        signal
      </span>
    </button>
  );
}

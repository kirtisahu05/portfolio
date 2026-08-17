"use client";

import { useTheme } from "@/lib/theme-context";

export default function TypingIndicator() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <div className="flex justify-start">
      <div
        className="flex items-center gap-1.5 rounded-lg border px-4 py-3"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        aria-label="Thinking"
      >
        {isSignal ? (
          <span className="font-[var(--font-mono)] text-xs" style={{ color: "var(--accent)" }}>
            thinking...
          </span>
        ) : (
          [0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full"
              style={{ background: "var(--text-muted)", animationDelay: `${i * 0.15}s` }}
            />
          ))
        )}
      </div>
    </div>
  );
}

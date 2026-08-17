"use client";

import { navItems, profile } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";

export default function Footer() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 sm:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="font-[var(--font-display)] text-sm font-semibold text-[var(--accent)]">
            {profile.handle}
          </p>
          {isSignal && (
            <p className="mt-2 font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]">
              $ cat mission.txt
            </p>
          )}
          <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">
            Building scalable, production-grade frontend systems with clean architecture and
            thoughtful engineering.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-x-6 gap-y-2 font-[var(--font-mono)] text-[13px] text-[var(--text-secondary)]">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-[var(--text-primary)]">
              {isSignal ? "→ " : ""}
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-5xl px-6 pb-8 text-xs text-[var(--text-muted)]">
        © {new Date().getFullYear()} {profile.name}
      </div>
    </footer>
  );
}

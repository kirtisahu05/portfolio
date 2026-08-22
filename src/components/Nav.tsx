"use client";

import { useState } from "react";
import Link from "next/link";
import { navItems, profile } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";
import { MULTI_UI_ENABLED, PREP_NAV_ENABLED } from "@/lib/feature-flags";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const { theme } = useTheme();
  const isSignal = theme === "b";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/#top"
            className="font-[var(--font-display)] text-sm font-semibold tracking-wide text-[var(--accent)]"
          >
            {profile.handle}
          </Link>
          {theme === "b" && (
            <span className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
              <span className="h-2 w-2 rounded-full" style={{ background: "#7ee787" }} />
              <span className="h-2 w-2 rounded-full" style={{ background: "#5b9dd9" }} />
              <span className="h-2 w-2 rounded-full" style={{ background: "#d9a85b" }} />
              <span className="h-2 w-2 rounded-full" style={{ background: "#d95b6e" }} />
            </span>
          )}
        </div>
        <nav className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-1 font-[var(--font-mono)] text-[13px] text-[var(--text-secondary)] lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link whitespace-nowrap hover:text-[var(--text-primary)]"
            >
              {item.label}
            </a>
          ))}
          <Link href="/log" className="nav-link whitespace-nowrap hover:text-[var(--text-primary)]">
            {isSignal ? "./log" : "log"}
          </Link>
          {PREP_NAV_ENABLED && (
            <Link href="/prep" className="nav-link whitespace-nowrap hover:text-[var(--text-primary)]">
              {isSignal ? "./prep" : "prep"}
            </Link>
          )}
          <Link
            href="/ask"
            className="nav-link whitespace-nowrap hover:text-[var(--text-primary)]"
            style={{ color: "var(--accent)" }}
          >
            {isSignal ? "./ask-ai" : "ask ai"}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {isSignal && (
            <a
              href="/resume.pdf" target="_blank" rel="noopener noreferrer"
              className="hidden rounded-md border px-3 py-1.5 font-[var(--font-mono)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] sm:inline-block"
              style={{ borderColor: "var(--border-strong)" }}
            >
              resume.exe
            </a>
          )}
          {MULTI_UI_ENABLED && <ThemeToggle />}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="flex h-8 w-8 items-center justify-center rounded-md border text-[var(--text-secondary)] lg:hidden"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 5h14M3 10h14M3 15h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="flex flex-col gap-1 border-t px-6 py-4 font-[var(--font-mono)] text-sm text-[var(--text-secondary)] lg:hidden"
          style={{ borderColor: "var(--border)" }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="nav-link rounded-md px-2 py-2 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/log"
            onClick={() => setMenuOpen(false)}
            className="nav-link rounded-md px-2 py-2 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          >
            {isSignal ? "./log" : "log"}
          </Link>
          {PREP_NAV_ENABLED && (
            <Link
              href="/prep"
              onClick={() => setMenuOpen(false)}
              className="nav-link rounded-md px-2 py-2 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            >
              {isSignal ? "./prep" : "prep"}
            </Link>
          )}
          <Link
            href="/ask"
            onClick={() => setMenuOpen(false)}
            className="nav-link rounded-md px-2 py-2 hover:bg-[var(--bg-elevated)]"
            style={{ color: "var(--accent)" }}
          >
            {isSignal ? "./ask-ai" : "ask ai"}
          </Link>
          {isSignal && (
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-2 py-2 hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            >
              resume.exe
            </a>
          )}
        </nav>
      )}
    </header>
  );
}

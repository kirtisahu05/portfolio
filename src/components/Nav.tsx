"use client";

import { useState } from "react";
import Link from "next/link";
import { consulting, navItems, primaryNavHrefs, profile } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";
import { MULTI_UI_ENABLED } from "@/lib/feature-flags";
import ThemeToggle from "./ThemeToggle";
import SchedulingDialog, { isEmbeddableSchedule } from "./SchedulingDialog";

export default function Nav() {
  const { theme } = useTheme();
  const isSignal = theme === "b";
  const [menuOpen, setMenuOpen] = useState(false);
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  const embeddable = isEmbeddableSchedule(consulting.ctaUrl);
  const desktopItems = isSignal ? navItems : navItems.filter((item) => primaryNavHrefs.includes(item.href));
  // Opens the in-page booking dialog; modifier clicks fall through to the link.
  const openScheduling = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!embeddable || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setMenuOpen(false);
    setSchedulingOpen(true);
  };
  const schedulingHref = consulting.ctaUrl || `mailto:${profile.email}?subject=Let%27s%20talk`;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur">
      <div className="page-container flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/#top"
            className="font-[var(--font-display)] text-sm font-semibold tracking-wide text-[var(--nav-brand)]"
          >
            {/* Wordmark: mint slash, cream name (BotFriday's "AI" accent). */}
            <span className="text-[var(--nav-accent)]">{profile.handle.slice(0, 1)}</span>
            {profile.handle.slice(1)}
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
        <nav
          className={`hidden flex-wrap items-center justify-end gap-x-4 gap-y-1 text-[var(--nav-text)] lg:flex ${
            isSignal ? "font-[var(--font-mono)] text-[13px]" : "gap-x-7 text-[15px]"
          }`}
        >
          {desktopItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link whitespace-nowrap hover:text-[var(--nav-text-hover)]"
            >
              {item.label}
            </a>
          ))}
          <Link href="/log" className="nav-link whitespace-nowrap hover:text-[var(--nav-text-hover)]">
            {isSignal ? "./log" : "log"}
          </Link>
          <Link
            href="/ask-ai"
            className="nav-link whitespace-nowrap hover:text-[var(--nav-text-hover)]"
            style={{ color: "var(--nav-accent)" }}
          >
            {isSignal ? "./ask-ai" : "ask ai"}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {isSignal && (
            <a
              href="/resume.pdf" target="_blank" rel="noopener noreferrer"
              className="hidden rounded-md border px-3 py-1.5 font-[var(--font-mono)] text-xs text-[var(--text-secondary)] hover:text-[var(--nav-text-hover)] sm:inline-block"
              style={{ borderColor: "var(--border-strong)" }}
            >
              resume.exe
            </a>
          )}
          {MULTI_UI_ENABLED && <ThemeToggle />}
          {!isSignal && (
            <>
              <span className="hidden h-6 w-px bg-[var(--nav-border)] sm:block" aria-hidden="true" />
              <a
                href={schedulingHref}
                target={consulting.ctaUrl ? "_blank" : undefined}
                rel={consulting.ctaUrl ? "noopener noreferrer" : undefined}
                onClick={openScheduling}
                className="hidden items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm text-[var(--nav-accent)] transition hover:bg-[var(--nav-border)] sm:inline-flex"
                style={{ borderColor: "var(--nav-accent)" }}
              >
                Schedule a call <span aria-hidden="true">→</span>
              </a>
            </>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="flex h-8 w-8 items-center justify-center rounded-md border text-[var(--nav-text)] lg:hidden"
            style={{ borderColor: "var(--nav-border)" }}
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
          className={`flex flex-col gap-1 border-t px-6 py-4 text-[var(--nav-text)] lg:hidden ${isSignal ? "font-[var(--font-mono)] text-sm" : "text-[15px]"}`}
          style={{ borderColor: "var(--nav-border)" }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="nav-link rounded-md px-2 py-2 hover:bg-[var(--nav-border)] hover:text-[var(--nav-text-hover)]"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/log"
            onClick={() => setMenuOpen(false)}
            className="nav-link rounded-md px-2 py-2 hover:bg-[var(--nav-border)] hover:text-[var(--nav-text-hover)]"
          >
            {isSignal ? "./log" : "log"}
          </Link>
          <Link
            href="/ask-ai"
            onClick={() => setMenuOpen(false)}
            className="nav-link rounded-md px-2 py-2 hover:bg-[var(--nav-border)]"
            style={{ color: "var(--nav-accent)" }}
          >
            {isSignal ? "./ask-ai" : "ask ai"}
          </Link>
          {isSignal && (
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-2 py-2 hover:bg-[var(--nav-border)] hover:text-[var(--nav-text-hover)]"
            >
              resume.exe
            </a>
          )}
          {!isSignal && (
            <a
              href={schedulingHref}
              onClick={openScheduling}
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-[var(--nav-accent)]"
              style={{ borderColor: "var(--nav-accent)" }}
            >
              Schedule a call <span aria-hidden="true">→</span>
            </a>
          )}
        </nav>
      )}
      {!isSignal && embeddable && (
        <SchedulingDialog url={consulting.ctaUrl} open={schedulingOpen} onClose={() => setSchedulingOpen(false)} />
      )}
    </header>
  );
}

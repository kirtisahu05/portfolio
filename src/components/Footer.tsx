"use client";

import Link from "next/link";
import { FaLinkedin } from "react-icons/fa6";
import { SiGithub, SiMedium } from "react-icons/si";
import { TbCalendarUser, TbMail } from "react-icons/tb";
import type { IconType } from "react-icons";
import { navItems, profile } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";

const TAGLINE =
  "Building scalable, production-grade frontend systems with clean architecture and thoughtful engineering.";

// Previous footer — kept as the signal theme's version.
function SignalFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      <div className="page-container grid gap-8 py-10 sm:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="font-[var(--font-display)] text-sm font-semibold text-[var(--accent)]">
            {profile.handle}
          </p>
          <p className="mt-2 font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]">$ cat mission.txt</p>
          <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">{TAGLINE}</p>
        </div>
        <nav className="grid grid-cols-2 gap-x-6 gap-y-2 font-[var(--font-mono)] text-[13px] text-[var(--text-secondary)]">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-[var(--text-primary)]">
              {"→ "}
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="page-container pb-8 text-xs text-[var(--text-muted)]">
        © {new Date().getFullYear()} {profile.name}
      </div>
    </footer>
  );
}

const SOCIALS: { label: string; href: string; icon: IconType }[] = [
  { label: "LinkedIn", href: profile.links.linkedin, icon: FaLinkedin },
  { label: "GitHub", href: profile.links.github, icon: SiGithub },
  { label: "Medium", href: profile.links.medium, icon: SiMedium },
  { label: "Topmate", href: profile.links.topmate, icon: TbCalendarUser },
  { label: "Email", href: `mailto:${profile.email}`, icon: TbMail },
].filter((s) => s.href);

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "On this page",
    // navItems labels are lowercase (signal shows them that way).
    links: navItems.map((item) => ({ label: item.label.charAt(0).toUpperCase() + item.label.slice(1), href: item.href })),
  },
  {
    title: "Explore",
    links: [
      { label: "Log", href: "/log" },
      { label: "Ask AI", href: "/ask-ai" },
      { label: "Resume", href: "/resume.pdf", external: true },
    ],
  },
  {
    title: "Elsewhere",
    links: SOCIALS.map((s) => ({ label: s.label, href: s.href, external: !s.href.startsWith("mailto:") })),
  },
];

// Default theme: dark footer with brand block, link columns, and a bottom
// bar (BotFriday's footer structure).
function DefaultFooter() {
  return (
    <footer className="band-dark">
      <div className="page-container grid gap-10 py-14 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/#top" className="font-[var(--font-display)] text-lg font-semibold tracking-wide text-[var(--text-primary)]">
            <span className="text-[var(--accent)]">{profile.handle.slice(0, 1)}</span>
            {profile.handle.slice(1)}
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">{TAGLINE}</p>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-[var(--accent)] transition hover:bg-[var(--bg-elevated)]"
            style={{ borderColor: "var(--accent)" }}
          >
            <FaLinkedin className="h-4 w-4" aria-hidden="true" /> Connect on LinkedIn
          </a>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={label}
                title={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                style={{ borderColor: "var(--border)" }}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="page-container flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-[var(--text-muted)]">
          <span>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </span>
          <span>Designed, built, and shipped solo · Next.js on Vercel</span>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  const { theme } = useTheme();
  return theme === "b" ? <SignalFooter /> : <DefaultFooter />;
}

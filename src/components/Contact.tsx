"use client";

import { consulting, profile } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";

export default function Contact() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  const links = [
    { label: "GitHub", value: profile.links.github },
    { label: "LinkedIn", value: profile.links.linkedin },
    { label: "LeetCode", value: profile.links.leetcode },
    { label: "Medium", value: profile.links.medium },
    { label: "YouTube", value: profile.links.youtube },
  ].filter((link) => link.value);

  return (
    <section
      id="contact"
      className="mx-auto max-w-5xl px-6 py-14"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {isSignal && (
        <p className="mb-2 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">
          contact
        </p>
      )}
      <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
        {isSignal ? "connect --preferred-channel" : "Get in touch"}
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
        Open to senior/architect-level frontend and AI-adjacent full-stack roles.
      </p>

      <div
        className="mt-6 rounded-lg border p-5"
        style={{ borderColor: "var(--accent)", background: "var(--bg-elevated)" }}
      >
        {isSignal && (
          <p className="mb-2 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
            $ cat consulting.txt
          </p>
        )}
        <p className="max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
          {consulting.blurb}
        </p>
        <a
          href={consulting.ctaUrl || `mailto:${profile.email}?subject=Consulting%20inquiry`}
          target={consulting.ctaUrl ? "_blank" : undefined}
          rel={consulting.ctaUrl ? "noopener noreferrer" : undefined}
          className="mt-4 inline-block rounded-md px-5 py-2.5 text-sm font-medium bg-[var(--text-primary)] text-[var(--bg)]"
        >
          {consulting.ctaLabel}
        </a>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div
          className="rounded-lg border p-5"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          {isSignal && (
            <p className="mb-2 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
              $ cat contact.txt
            </p>
          )}
          {/* TODO: replace with your real email in src/lib/content.ts */}
          <a href={`mailto:${profile.email}`} className="block text-sm text-[var(--accent)]">
            {profile.email}
          </a>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{profile.location}</p>
        </div>

        {links.map((link) => (
          <a
            key={link.label}
            href={link.value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center rounded-lg border p-5 hover:border-[var(--border-strong)]"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{link.label}</p>
              <p className="mt-0.5 font-[var(--font-mono)] text-xs text-[var(--text-muted)]">
                {link.value?.replace(/^https?:\/\//, "")}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

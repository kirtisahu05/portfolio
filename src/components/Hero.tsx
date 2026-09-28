"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";

export default function Hero() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <section id="top" className="mx-auto max-w-5xl px-6 pb-16 pt-14 sm:pt-20">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div className="hero-in min-w-0">
          {isSignal ? (
            <p className="mb-4 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">
              {"// portfolio boot sequence"}
            </p>
          ) : (
            <p className="mb-4 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {profile.role} · {profile.location}
            </p>
          )}
          <div className="flex items-center gap-4">
            <Avatar name={profile.name} src={profile.photo} />
            <h1
              className="max-w-xl font-[var(--font-display)] text-3xl font-semibold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl"
              style={{ textTransform: "none" }}
            >
              {profile.name}
            </h1>
          </div>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-[var(--text-primary)]">
            {profile.tagline}
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
            {profile.aiTagline}
          </p>

          {isSignal && (
            <p className="mt-4 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
              $ cat about.md
            </p>
          )}
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {profile.bio}
          </p>

          {isSignal && (
            <div
              className="mt-8 rounded-lg border p-5 font-[var(--font-mono)] text-[13px]"
              style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
            >
              <p style={{ color: "var(--accent)" }}>&gt; USER_ID: {profile.handle.replace("/", "_")}</p>
              <p style={{ color: "var(--accent)" }}>&gt; ROLE: {profile.role.toUpperCase()}</p>
              <p style={{ color: "var(--accent)" }}>&gt; STATUS: OPEN_TO_OPPORTUNITIES</p>
              <p style={{ color: "var(--accent)" }}>
                &gt; LOCATION: {profile.location.toUpperCase()}_
              </p>
              <p style={{ color: "var(--accent)" }}>
                &gt; PREFERENCE: {profile.workPreference.toUpperCase()}_
              </p>
              <p style={{ color: "var(--accent)" }}>
                &gt; TIMEZONE: {profile.timezone.toUpperCase()}_
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              className="rounded-md px-5 py-2.5 text-sm font-medium bg-[var(--text-primary)] text-[var(--bg)] transition hover:opacity-90 active:scale-[0.98]"
            >
              {isSignal ? "./view-projects" : "View work"}
            </a>
            <a
              href="/resume.pdf" target="_blank" rel="noopener noreferrer"
              className="rounded-md border px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-elevated)] active:scale-[0.98]"
              style={{ borderColor: "var(--border-strong)" }}
            >
              Resume
            </a>
          </div>
        </div>

        <aside
          className="hero-in-block rounded-lg border p-6"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          {isSignal && (
            <p className="mb-1 font-[var(--font-mono)] text-[11px] tracking-wide text-[var(--accent)]">
              SYSTEM.INFO
            </p>
          )}
          <p className="font-[var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
            {profile.role}
          </p>
          {/* <p className="mt-1 text-sm text-[var(--text-muted)]">{profile.location}</p> */}
          <p className="mt-1 text-sm text-[var(--text-muted)]">{profile.workPreference}</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{profile.timezone}</p>

          <p className="mb-2 mt-6 font-[var(--font-mono)] text-[11px] tracking-wide text-[var(--text-muted)]">
            QUICK FACTS
          </p>
          <ul>
            {profile.quickFacts.map((fact) => (
              <li
                key={fact}
                className="border-t py-2.5 text-[13px] leading-snug text-[var(--text-secondary)] first:border-t-0 first:pt-0"
                style={{ borderColor: "var(--border)" }}
              >
                {fact}
              </li>
            ))}
          </ul>

          <p className="mb-3 mt-6 font-[var(--font-mono)] text-[11px] tracking-wide text-[var(--text-muted)]">
            CORE STRENGTHS
          </p>
          <div className="space-y-3">
            {profile.coreStrengths.map((strength) => (
              <div key={strength.title}>
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">{strength.title}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-[var(--text-secondary)]">{strength.items}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

// Renders profile.photo once it's confirmed to load; falls back to initials
// otherwise. Preloads via a detached Image rather than an <img onError>, since
// a fast 404 can fire the native error event before React hydrates and
// attaches the handler, leaving a broken-image box on screen.
function Avatar({ name, src }: { name: string; src?: string }) {
  const [loaded, setLoaded] = useState(false);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.onload = () => setLoaded(true);
    img.src = src;
    return () => {
      img.onload = null;
    };
  }, [src]);

  if (!loaded) {
    return (
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border font-[var(--font-display)] text-xl font-semibold"
        style={{ borderColor: "var(--border-strong)", background: "var(--bg-elevated)", color: "var(--text-primary)" }}
      >
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- src is already confirmed loaded via the preload check above
    <img
      src={src}
      alt={name}
      className="h-20 w-20 shrink-0 rounded-full border object-cover transition-transform duration-300 ease-out hover:rotate-0"
      style={{ borderColor: "var(--border-strong)", transform: "rotate(-38deg)" }}
    />
  );
}

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
        <div className="min-w-0">
          {isSignal && (
            <p className="mb-4 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">
              {"// portfolio boot sequence"}
            </p>
          )}
          <div className="flex items-center gap-4">
            <Avatar name={profile.name} src={profile.photo} />
            <h1
              className="max-w-xl font-[var(--font-display)] text-3xl font-semibold leading-tight text-[var(--text-primary)] sm:text-4xl"
              style={{ textTransform: "none" }}
            >
              {profile.name}
            </h1>
          </div>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {profile.tagline}
          </p>

          {isSignal && (
            <p className="mt-4 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
              $ cat about.md
            </p>
          )}
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
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

          <div className="mt-8 flex gap-3">
            <a
              href="#work"
              className="rounded-md px-5 py-2.5 text-sm font-medium bg-[var(--text-primary)] text-[var(--bg)]"
            >
              {isSignal ? "./view-projects" : "View work"}
            </a>
            <a
              href="/resume.pdf" target="_blank" rel="noopener noreferrer"
              className="rounded-md border px-5 py-2.5 text-sm font-medium text-[var(--text-primary)]"
              style={{ borderColor: "var(--border-strong)" }}
            >
              Resume
            </a>
          </div>
        </div>

        <aside
          className="rounded-lg border p-6"
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
          <ul className="space-y-2">
            {profile.quickFacts.map((fact) => (
              <li
                key={fact}
                className="rounded-md border px-3 py-2 text-[13px] leading-snug text-[var(--text-secondary)]"
                style={{ borderColor: "var(--border)" }}
              >
                {fact}
              </li>
            ))}
          </ul>

          <p className="mb-3 mt-6 font-[var(--font-mono)] text-[11px] tracking-wide text-[var(--text-muted)]">
            CORE_VITALS
          </p>
          <div className="space-y-3">
            {profile.vitals.map((vital) => (
              <div key={vital.label}>
                <div className="mb-1 flex items-center justify-between font-[var(--font-mono)] text-[11px] text-[var(--text-secondary)]">
                  <span>{vital.label}</span>
                  <span>{vital.value}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full" style={{ background: "var(--border)" }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${vital.value}%`, background: "var(--accent)" }}
                  />
                </div>
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
      className="h-20 w-20 shrink-0 rounded-full border object-cover"
      style={{ borderColor: "var(--border-strong)", transform: "rotate(-38deg)" }}
    />
  );
}

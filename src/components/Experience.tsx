"use client";

import { experience } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";
import { getSkillIcon } from "@/lib/skill-icons";
import BulletList from "./BulletList";

export default function Experience() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <section
      id="experience"
      className="mx-auto max-w-5xl px-6 py-14"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {isSignal && (
        <p className="mb-2 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">
          experience
        </p>
      )}
      <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
        {isSignal ? "git log --career --oneline" : "Experience"}
      </h2>

      <div className="mt-8 space-y-4">
        {experience.map((item, i) => (
          <div
            key={item.id}
            className="rounded-lg border p-5"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                {isSignal && (
                  <p className="mb-1 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
                    commit {String(i + 1).padStart(4, "0")}
                  </p>
                )}
                <h3 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
                  {item.role}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {item.company}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
              </div>
              <span
                className="whitespace-nowrap rounded-full border px-3 py-1 font-[var(--font-mono)] text-[11px] text-[var(--text-secondary)]"
                style={{ borderColor: "var(--border-strong)" }}
              >
                {item.period}
              </span>
            </div>

            <p className="mt-3 max-w-2xl text-[13px] italic leading-relaxed text-[var(--text-muted)]">
              {item.companyProfile}
            </p>
            <p className="mt-2 font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]">
              {isSignal ? "$ " : ""}Project: {item.project}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.techStack.map((tech) => {
                const Icon = getSkillIcon(tech);
                return (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded px-2 py-1 font-[var(--font-mono)] text-[11px] text-[var(--text-secondary)]"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {tech}
                  </span>
                );
              })}
            </div>

            <BulletList items={item.bullets} sign="+" className="mt-4" />
          </div>
        ))}
      </div>
    </section>
  );
}

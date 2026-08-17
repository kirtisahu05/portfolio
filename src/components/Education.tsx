"use client";

import { education } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";
import BulletList from "./BulletList";

export default function Education() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <section
      id="education"
      className="mx-auto max-w-5xl px-6 py-14"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {isSignal && (
        <p className="mb-2 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">
          education
        </p>
      )}
      <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
        {isSignal ? "cat ./education.md" : "Education"}
      </h2>
      <div className="mt-8 space-y-4">
        {education.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border p-5"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
                  {item.degree}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">{item.institution}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.board}</p>
              </div>
              <span
                className="whitespace-nowrap rounded-full border px-3 py-1 font-[var(--font-mono)] text-[11px] text-[var(--text-secondary)]"
                style={{ borderColor: "var(--border-strong)" }}
              >
                {item.period}
              </span>
            </div>
            {item.details.length > 0 && (
              <BulletList items={item.details} sign="-" className="mt-3" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

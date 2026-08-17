"use client";

import { professionalAbilities, whyHireMe, whyHireMeClosing, whyHireMeIntro } from "@/lib/content";
import { renderInline } from "@/lib/inline-markdown";
import { useTheme } from "@/lib/theme-context";
import BulletList from "./BulletList";

export default function WhyHireMe() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <section
      id="why"
      className="mx-auto max-w-5xl px-6 py-14"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {isSignal && (
        <p className="mb-2 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">
          why me
        </p>
      )}
      <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
        {isSignal ? "cat ./value-proposition.md" : "Why work with me"}
      </h2>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)]">
        <span className="font-semibold text-[var(--text-primary)]">{whyHireMeIntro.lead}</span> {whyHireMeIntro.body}
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {whyHireMe.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border p-5"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            {isSignal && (
              <p className="mb-2 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
                cat {item.file}
              </p>
            )}
            <h3 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-5 rounded-lg border p-5"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        {isSignal && (
          <p className="mb-2 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
            cat strengths/what-you-get.txt
          </p>
        )}
        <h3 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
          {whyHireMeClosing.lead}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {renderInline(whyHireMeClosing.body)}
        </p>
      </div>

      <div
        className="mt-5 rounded-lg border p-5"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        {isSignal && (
          <p className="mb-2 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
            cat strengths/professional-abilities.txt
          </p>
        )}
        <h3 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
          Professional abilities
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
          The practices I bring to the day-to-day work of building, scaling, and leading engineering teams.
        </p>
        <BulletList items={professionalAbilities} sign="+" className="mt-4" />
      </div>
    </section>
  );
}

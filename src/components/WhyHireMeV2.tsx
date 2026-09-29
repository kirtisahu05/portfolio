"use client";

import { whyHireMeV2, whyHireMeV2Intro } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";
import SectionIntro from "@/components/SectionIntro";

// The live "Why work with me" section — replaced the older WhyHireMe, which is
// kept (unrendered) along with its content for the Ask AI knowledge base.
export default function WhyHireMeV2() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <section
      id="why-me"
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
      <SectionIntro>
        <span className="font-semibold text-[var(--text-primary)]">{whyHireMeV2Intro.lead}</span>{" "}
        {whyHireMeV2Intro.body}
      </SectionIntro>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {whyHireMeV2.map((item) => (
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
    </section>
  );
}

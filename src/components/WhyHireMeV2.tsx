"use client";

import { whyHireMeV2, whyHireMeV2Intro } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";
import SectionIntro from "@/components/SectionIntro";
import Band from "@/components/Band";
import SectionHeading from "@/components/SectionHeading";

// The live "Why work with me" section — replaced the older WhyHireMe, which is
// kept (unrendered) along with its content for the Ask AI knowledge base.
// BotFriday-style emphasis: one mint card for the key point, one dark card
// for contrast; the rest stay sand. Default theme only.
const HIGHLIGHTS: Record<string, "mint" | "dark"> = {
  "individual-contributor": "mint",
  ai: "dark",
};

export default function WhyHireMeV2() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <Band id="why-me" tone="cream">
      <SectionHeading
        label="Why me"
        title={"Why work with me"}
        signalLabel="why me"
        signalTitle="cat ./value-proposition.md"
      />
      <SectionIntro>
        <span className="font-semibold text-[var(--text-primary)]">{whyHireMeV2Intro.lead}</span>{" "}
        {whyHireMeV2Intro.body}
      </SectionIntro>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {whyHireMeV2.map((item) => {
          const highlight = isSignal ? undefined : HIGHLIGHTS[item.id];
          return (
            <div
              key={item.id}
              className={`rounded-lg border p-5 ${highlight ? `card-${highlight}` : ""}`}
              // card-dark paints its own background; an inline --bg-elevated
              // (translucent inside dark surfaces) would override it.
              style={{
                borderColor: "var(--border)",
                background: highlight === "dark" ? undefined : "var(--bg-elevated)",
              }}
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
          );
        })}
      </div>
    </Band>
  );
}

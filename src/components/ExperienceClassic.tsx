"use client";

import { coffeeWebCaseStudy, experience } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";
import { getSkillIcon } from "@/lib/skill-icons";
import BulletList from "./BulletList";

// The Experience layout in use: one stacked card per role, in both themes.
// (A sticky-rail timeline alternative is archived in ExperienceTimeline.tsx.)

// Hidden for now — the before/after framing undersells the role. Content stays
// in content.ts (coffeeWebCaseStudy); flip to true to bring it back.
const SHOW_COFFEEWEB_CASE_STUDY = false;

type Item = (typeof experience)[number];

// DRAFT review: on the dev server only, a rewritten entry renders side by side
// with the current one (current left, draft right). Add a draft here keyed by
// the role's id; production never shows drafts.
// No drafts under review right now. To add one:
//   process.env.NODE_ENV === "development" ? { <roleId>: <draftEntry> } : {}
const DRAFTS: Record<string, Item> = {};

export default function ExperienceClassic() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  const renderCard = (item: Item, i: number, variant?: "current" | "draft") => (
    <div
      key={`${item.id}-${variant ?? "live"}`}
      className={`rounded-lg border p-5 ${variant === "draft" ? "border-2 border-dashed" : ""}`}
      style={{
        borderColor: variant === "draft" ? "var(--accent)" : "var(--border)",
        background: "var(--bg-elevated)",
      }}
    >
      {variant === "draft" && (
        <p className="mb-3 inline-block rounded bg-[var(--accent)] px-2 py-0.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-wide text-[var(--accent-contrast)]">
          Draft · new entry (dev only)
        </p>
      )}
      {variant === "current" && (
        <p
          className="mb-3 inline-block rounded border px-2 py-0.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
          style={{ borderColor: "var(--border-strong)" }}
        >
          Current entry
        </p>
      )}
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

      {SHOW_COFFEEWEB_CASE_STUDY && item.id === "coffeeweb" && (
        <div
          className="mt-5 rounded-lg border border-dashed p-4"
          style={{ borderColor: "var(--border-strong)" }}
        >
          <p className="font-[var(--font-display)] text-sm font-semibold text-[var(--text-primary)]">
            {coffeeWebCaseStudy.title}
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                Before
              </p>
              <BulletList items={coffeeWebCaseStudy.before} sign="-" className="mt-2" />
            </div>
            <div>
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                What I changed
              </p>
              <BulletList items={coffeeWebCaseStudy.after} sign="+" className="mt-2" />
            </div>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">Result: </span>
            {coffeeWebCaseStudy.result}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-8 space-y-4">
      {experience.map((item, i) =>
        DRAFTS[item.id] ? (
          <div key={`${item.id}-compare`} className="grid items-start gap-4 lg:grid-cols-2">
            {renderCard(item, i, "current")}
            {renderCard(DRAFTS[item.id], i, "draft")}
          </div>
        ) : (
          renderCard(item, i)
        )
      )}
    </div>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { experience } from "@/lib/content";
import { getSkillIcon } from "@/lib/skill-icons";
import BulletList from "./BulletList";

// ARCHIVED (not shown) — the sticky-rail timeline layout for Experience ("T1"),
// tried as the default and parked for a later decision. Turn it back on by
// setting EXPERIENCE_LAYOUT to "timeline" in Experience.tsx.

type Role = (typeof experience)[number];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Month index (year * 12 + month) of "now", read only in the browser. The page
// is prerendered, so the server snapshot is null and "Present" roles skip their
// duration until hydration — otherwise the text would mismatch once the
// calendar month moves past the build date.
const subscribeNoop = () => () => {};
function useNowMonth(): number | null {
  return useSyncExternalStore(
    subscribeNoop,
    () => {
      const d = new Date();
      return d.getFullYear() * 12 + d.getMonth();
    },
    () => null
  );
}

// "Mar 2019 — Jul 2020" → "1 yr 5 mos" (start and end months both counted).
function durationLabel(period: string, nowMonth: number | null): string {
  const parts = [...period.matchAll(/([A-Z][a-z]{2})\s+(\d{4})/g)].map(
    (m) => Number(m[2]) * 12 + Math.max(0, MONTHS.indexOf(m[1]))
  );
  const isPresent = /present/i.test(period);
  if (!parts.length || (isPresent && nowMonth === null)) return "";
  const end = isPresent ? nowMonth! : parts[1] ?? parts[0];
  const total = Math.max(1, end - parts[0] + 1);
  const y = Math.floor(total / 12);
  const m = total % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}

// "Aug 2023 — Present" → "2023 – Now"; "Mar 2018 — Mar 2019" → "2018 – 2019".
function yearsLabel(period: string): string {
  const ys = period.match(/\d{4}/g) ?? [];
  if (/present/i.test(period)) return `${ys[0]} – Now`;
  return ys[0] === ys[1] ? ys[0] : `${ys[0]} – ${ys[1]}`;
}

function TechChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((tech) => {
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
  );
}

// Sticky-rail timeline: each role is a row — a left rail (years, dates, time
// spent, role, company, full stack) that stays in view while you read, and the
// complete write-up on the right. Nothing is trimmed: every profile, project,
// tech item, and bullet is shown.
export default function ExperienceTimeline() {
  const nowMonth = useNowMonth();
  return (
    <ol className="mt-8 space-y-10">
      {experience.map((r: Role, i) => {
        const duration = durationLabel(r.period, nowMonth);
        return (
          <li key={r.id} className="grid gap-5 lg:grid-cols-[260px_1fr] lg:gap-10">
            <div className="relative lg:sticky lg:top-24 lg:self-start">
              <div className="flex items-baseline gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: i === 0 ? "var(--accent)" : "var(--border-strong)" }}
                  aria-hidden="true"
                />
                <span className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  {yearsLabel(r.period)}
                </span>
              </div>
              <p className="ml-6 mt-1 font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]">
                {r.period}
                {duration && ` · ${duration}`}
              </p>
              <h3 className="ml-6 mt-3 font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
                {r.role}
              </h3>
              <p className="ml-6 text-sm text-[var(--text-muted)]">
                {r.company}
                {r.location ? ` · ${r.location}` : ""}
              </p>
              <div className="ml-6 mt-4">
                <TechChips items={r.techStack} />
              </div>
            </div>
            <div
              className="rounded-lg border p-5 sm:p-6"
              style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
            >
              <p className="text-[13px] italic leading-relaxed text-[var(--text-muted)]">{r.companyProfile}</p>
              <p className="mt-2 font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]">Project: {r.project}</p>
              <BulletList items={r.bullets} sign="+" className="mt-5" />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

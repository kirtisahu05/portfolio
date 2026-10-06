"use client";

import { useState, type ReactNode } from "react";
import { skills } from "@/lib/content";
import { getSkillIcon } from "@/lib/skill-icons";
import { skillGroups } from "@/components/Skills";
import Band from "@/components/Band";

// DRAFT — three alternative layouts for the Skills section, rendered under the
// live one so they can be compared on screen. Development only (see page.tsx);
// production never renders this. Delete or promote one once a layout is picked.

type GroupKey = keyof typeof skills;
const group = (key: GroupKey) => skillGroups.find((g) => g.key === key)!;

function Chips({ k, size = "sm" }: { k: GroupKey; size?: "sm" | "md" }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills[k].map((skill) => {
        const Icon = getSkillIcon(skill);
        return (
          <span
            key={skill}
            className={`inline-flex items-center gap-1.5 rounded font-[var(--font-mono)] text-[var(--text-secondary)] ${
              size === "md" ? "px-2.5 py-1.5 text-[12px]" : "px-2 py-1 text-[11px]"
            }`}
            style={{ border: "1px solid var(--border)" }}
          >
            <Icon className={`${size === "md" ? "h-3.5 w-3.5" : "h-3 w-3"} shrink-0`} aria-hidden="true" />
            {skill}
          </span>
        );
      })}
    </div>
  );
}

function DraftFrame({ letter, title, note, children }: { letter: string; title: string; note: string; children: ReactNode }) {
  return (
    <div className="mt-12 rounded-xl border-2 border-dashed p-5 sm:p-6" style={{ borderColor: "var(--border-strong)" }}>
      <div className="mb-5 flex flex-wrap items-baseline gap-3">
        <span className="rounded bg-[var(--accent)] px-2 py-0.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-wide text-[var(--accent-contrast)]">
          Draft {letter}
        </span>
        <h3 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="text-[13px] text-[var(--text-muted)]">{note}</p>
      </div>
      {children}
    </div>
  );
}

// A — Bento: tile size follows how much is in each group, AI gets the dark
// highlight tile, and the 7 groups fill a 4×4 grid with no orphan card.
function BentoDraft() {
  const tiles: { k: GroupKey; span: string; dark?: boolean }[] = [
    { k: "frontend", span: "lg:col-span-2 lg:row-span-2" },
    { k: "ai", span: "lg:col-span-2", dark: true },
    { k: "languages", span: "lg:col-span-1" },
    { k: "remote", span: "lg:col-span-1" },
    { k: "backend", span: "lg:col-span-2 lg:row-span-2" },
    { k: "devops", span: "lg:col-span-2" },
    { k: "tooling", span: "lg:col-span-2" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map(({ k, span, dark }) => (
        <div
          key={k}
          className={`rounded-lg border p-5 ${span} ${dark ? "card-dark" : ""}`}
          style={{ borderColor: "var(--border)", background: dark ? undefined : "var(--bg-elevated)" }}
        >
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h4 className="font-[var(--font-display)] text-sm font-semibold text-[var(--text-primary)]">{group(k).label}</h4>
            <span className="font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]">{skills[k].length}</span>
          </div>
          <Chips k={k} />
        </div>
      ))}
    </div>
  );
}

// B — Tabs: one category at a time with larger chips. Short and scannable;
// the counts still show the breadth at a glance.
function TabsDraft() {
  const [active, setActive] = useState<GroupKey>("frontend");
  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr]">
      <div role="tablist" aria-label="Skill categories" className="flex flex-wrap gap-1.5 md:flex-col">
        {skillGroups.map((g) => {
          const isActive = g.key === active;
          return (
            <button
              key={g.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(g.key)}
              className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition"
              style={{
                borderColor: isActive ? "var(--accent)" : "var(--border)",
                background: isActive ? "var(--accent)" : "transparent",
                color: isActive ? "var(--accent-contrast)" : "var(--text-secondary)",
              }}
            >
              {g.label}
              <span className="font-[var(--font-mono)] text-[11px] opacity-70">{skills[g.key].length}</span>
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <h4 className="mb-4 font-[var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">{group(active).label}</h4>
        <Chips k={active} size="md" />
      </div>
    </div>
  );
}

// C — Stack layers: skills drawn as the layers of a system, top (AI) to
// foundation (languages), with how-I-work groups as a side rail. Reads like
// an architecture diagram, which fits a frontend architect.
function StackDraft() {
  const layers: { k: GroupKey; layer: string }[] = [
    { k: "ai", layer: "L4 · intelligence" },
    { k: "frontend", layer: "L3 · interface" },
    { k: "backend", layer: "L2 · services & data" },
    { k: "devops", layer: "L1 · delivery & infra" },
    { k: "languages", layer: "L0 · foundation" },
  ];
  const rails: GroupKey[] = ["tooling", "remote"];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
        {layers.map(({ k, layer }, i) => (
          <div
            key={k}
            className={`grid gap-3 p-4 sm:grid-cols-[170px_1fr] ${i === 0 ? "card-dark" : ""}`}
            style={{
              borderTop: i === 0 ? undefined : "1px solid var(--border)",
              background: i === 0 ? undefined : "var(--bg-elevated)",
            }}
          >
            <div>
              <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--text-muted)]">{layer}</p>
              <h4 className="mt-0.5 font-[var(--font-display)] text-sm font-semibold text-[var(--text-primary)]">{group(k).label}</h4>
            </div>
            <Chips k={k} />
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {rails.map((k) => (
          <div key={k} className="rounded-lg border border-dashed p-4" style={{ borderColor: "var(--border-strong)" }}>
            <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--text-muted)]">How I work</p>
            <h4 className="mb-3 mt-0.5 font-[var(--font-display)] text-sm font-semibold text-[var(--text-primary)]">{group(k).label}</h4>
            <Chips k={k} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsDrafts() {
  return (
    <Band tone="cream" innerClassName="pb-[var(--section-py)]">
      <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        Skills layout drafts · visible in dev only
      </p>
      <DraftFrame letter="A" title="Bento grid" note="Tile size follows content; AI highlighted; no orphan card.">
        <BentoDraft />
      </DraftFrame>
      <DraftFrame letter="B" title="Category tabs" note="One category at a time — shortest section, larger chips.">
        <TabsDraft />
      </DraftFrame>
      <DraftFrame letter="C" title="Stack layers" note="Skills as a system diagram, AI on top to languages at the base.">
        <StackDraft />
      </DraftFrame>
    </Band>
  );
}

"use client";

import type { ReactNode } from "react";
import { skills } from "@/lib/content";
import { getSkillIcon } from "@/lib/skill-icons";
import { skillGroups } from "@/components/Skills";
import Band from "@/components/Band";

// DRAFT — alternative grid layouts for the Skills section's 8 tiles, rendered
// under the live one so they can be compared on screen. Development only (see
// page.tsx); production never renders this. Same tiles and content as the live
// section — only the arrangement changes.

type GroupKey = (typeof skillGroups)[number]["key"];

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((skill) => {
        const Icon = getSkillIcon(skill);
        return (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 rounded px-2 py-1 font-[var(--font-mono)] text-[11px] text-[var(--text-secondary)]"
            style={{ border: "1px solid var(--border)" }}
          >
            <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
            {skill}
          </span>
        );
      })}
    </div>
  );
}

// One tile, as in the live section: AI & LLM is the dark highlight tile and
// carries its "AI coding tools" sub-list.
function Tile({ k, className = "" }: { k: GroupKey; className?: string }) {
  const g = skillGroups.find((x) => x.key === k)!;
  const dark = k === "ai";
  return (
    <div
      className={`rounded-lg border p-5 ${dark ? "card-dark" : ""} ${className}`}
      style={{ borderColor: "var(--border)", background: dark ? undefined : "var(--bg-elevated)" }}
    >
      <h4 className="mb-3 font-[var(--font-display)] text-sm font-semibold text-[var(--text-primary)]">{g.label}</h4>
      <Chips items={skills[k]} />
      {k === "ai" && (
        <>
          <p className="mb-2 mt-4 font-[var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
            AI coding tools
          </p>
          <Chips items={skills.aiCoding} />
        </>
      )}
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

const ZoneLabel = ({ children }: { children: ReactNode }) => (
  <p className="mb-3 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{children}</p>
);

// A — Masonry: three columns, each tile its natural height, packed top-down so
// there are no gaps under short tiles.
function MasonryDraft() {
  const order: GroupKey[] = ["frontend", "ai", "leadership", "backend", "languages", "remote", "devops", "tooling"];
  return (
    <div className="gap-4 sm:columns-2 lg:columns-3">
      {order.map((k) => (
        <div key={k} className="mb-4 break-inside-avoid">
          <Tile k={k} />
        </div>
      ))}
    </div>
  );
}

// B — Two zones: the tech stack in a grid on the left, "how I work" (AI coding,
// leadership, remote) in a column on the right. Separates what you build with
// from how you lead.
function TwoZonesDraft() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div>
        <ZoneLabel>Tech stack</ZoneLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Tile k="frontend" />
          <Tile k="backend" />
          <Tile k="languages" />
          <Tile k="devops" />
          <Tile k="tooling" className="sm:col-span-2" />
        </div>
      </div>
      <div>
        <ZoneLabel>How I work</ZoneLabel>
        <div className="space-y-4">
          <Tile k="ai" />
          <Tile k="leadership" />
          <Tile k="remote" />
        </div>
      </div>
    </div>
  );
}

// C — Six-column bento: tile widths follow item counts on a finer grid —
// Frontend and Backend share the top row, AI & LLM sits beside a wide
// Leadership tile, then three equal tiles, and Remote & Async as a slim strip.
function SixColDraft() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <Tile k="frontend" className="sm:col-span-2 lg:col-span-3" />
      <Tile k="backend" className="sm:col-span-2 lg:col-span-3" />
      <Tile k="ai" className="lg:col-span-2" />
      <Tile k="leadership" className="lg:col-span-4" />
      <Tile k="languages" className="lg:col-span-2" />
      <Tile k="devops" className="lg:col-span-2" />
      <Tile k="tooling" className="sm:col-span-2 lg:col-span-2" />
      <Tile k="remote" className="sm:col-span-2 lg:col-span-6" />
    </div>
  );
}

// D — Leadership first: for lead/architect roles, the people side leads —
// Leadership and Remote & Async across the top, AI & LLM highlighted, then the
// tech stack in an even three-column grid.
function LeadershipFirstDraft() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Tile k="leadership" />
        <Tile k="remote" />
      </div>
      <Tile k="ai" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile k="frontend" />
        <Tile k="backend" />
        <div className="space-y-4">
          <Tile k="languages" />
          <Tile k="devops" />
          <Tile k="tooling" />
        </div>
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
      <DraftFrame letter="A" title="Masonry" note="Three columns, natural tile heights, no gaps.">
        <MasonryDraft />
      </DraftFrame>
      <DraftFrame letter="B" title="Two zones" note="Tech stack on the left, how I work (AI, leadership, remote) on the right.">
        <TwoZonesDraft />
      </DraftFrame>
      <DraftFrame letter="C" title="Six-column bento" note="Finer grid so tile widths match their content.">
        <SixColDraft />
      </DraftFrame>
      <DraftFrame letter="D" title="Leadership first" note="People side on top for lead/architect roles, then the stack.">
        <LeadershipFirstDraft />
      </DraftFrame>
    </Band>
  );
}

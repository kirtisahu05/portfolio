"use client";

import type { ReactNode } from "react";
import { exploring, skills } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";
import { getSkillIcon } from "@/lib/skill-icons";
import { HIDE_EXPLORING } from "@/lib/feature-flags";
import SectionIntro from "@/components/SectionIntro";
import Band from "@/components/Band";
import SectionHeading from "@/components/SectionHeading";
import SnakeLayer from "@/components/SnakeLayer";

export const skillGroups: { key: keyof typeof skills; label: string; cmd: string }[] = [
  { key: "languages", label: "Languages", cmd: "cat stack/languages.txt" },
  { key: "frontend", label: "Frontend", cmd: "ls stack/frontend" },
  { key: "backend", label: "Backend", cmd: "ls stack/backend" },
  { key: "tooling", label: "Testing, Analytics & PM", cmd: "ls stack/tooling" },
  { key: "devops", label: "DevOps & Tools", cmd: "ls stack/tools" },
  { key: "ai", label: "AI & LLM", cmd: "ls stack/ai" },
  { key: "leadership", label: "Leadership", cmd: "ls stack/leadership" },
  { key: "remote", label: "Remote & Async", cmd: "ls stack/remote" },
];

// Default-theme layout. "zones" = tech stack grid on the left, "How I work"
// (AI, Leadership, Remote) column on the right — live. "bento" = the previous
// 4-column bento below, kept for rollback.
const SKILLS_LAYOUT = "zones" as "zones" | "bento";

// Ambient Nokia-style snake roaming the gaps between the cards (try-out).
// Set to false to turn it off.
const SHOW_SNAKE = true;

// What the snake eats: the distinct logos of every skill (generic fallback
// glyph excluded), so it snacks on the tech stack.
const SNAKE_FOOD = Array.from(
  new Set(
    Object.values(skills)
      .flat()
      .map((s) => getSkillIcon(s))
      .filter((Icon) => Icon !== getSkillIcon(""))
  )
);

// Default theme: bento layout (Draft A). Tile size follows how much is in each
// group, AI & LLM gets the dark highlight tile, and the 7 groups fill a 4×4
// grid with no orphan card. Order matters — it drives grid auto-placement.
const BENTO: { key: keyof typeof skills; span: string; dark?: boolean }[] = [
  { key: "frontend", span: "lg:col-span-2 lg:row-span-2" },
  { key: "ai", span: "lg:col-span-2", dark: true },
  { key: "languages", span: "lg:col-span-2" },
  { key: "backend", span: "lg:col-span-2 lg:row-span-2" },
  { key: "devops", span: "lg:col-span-2" },
  { key: "tooling", span: "lg:col-span-2" },
  // Closing row: Leadership (wide) and Remote & Async.
  { key: "leadership", span: "sm:col-span-2 lg:col-span-3" },
  { key: "remote", span: "sm:col-span-2 lg:col-span-1" },
];

const groupOf = (key: keyof typeof skills) => skillGroups.find((g) => g.key === key)!;

const ZoneLabel = ({ children }: { children: ReactNode }) => (
  <p data-snake-obstacle="row" className="mb-3 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{children}</p>
);

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

export default function Skills() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  const renderTile = (group: (typeof skillGroups)[number], span = "", dark = false) => (
    <div
      key={group.key}
      data-snake-obstacle
      className={`rounded-lg border p-5 ${span} ${dark ? "card-dark" : ""}`}
      style={{ borderColor: "var(--border)", background: dark ? undefined : "var(--bg-elevated)" }}
    >
      {isSignal && (
        <p className="mb-2 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
          {group.cmd}
        </p>
      )}
      <h3 className="mb-3 font-[var(--font-display)] text-sm font-semibold text-[var(--text-primary)]">
        {group.label}
      </h3>
      <Chips items={skills[group.key]} />
      {group.key === "ai" && (
        <>
          <p className="mb-2 mt-4 font-[var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
            {isSignal ? "// ai coding tools" : "AI coding tools"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {skills.aiCoding.map((tool) => {
              const Icon = getSkillIcon(tool);
              return (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1.5 rounded px-2 py-1 font-[var(--font-mono)] text-[11px] text-[var(--text-secondary)]"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {tool}
                </span>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  return (
    <Band id="skills" tone="cream">
      <SectionHeading
        label="Skills"
        title={"The tools I ship with."}
        signalLabel="skills"
        signalTitle="tree ./stack -L 2"
      />
      <SectionIntro>A compact view of the tools I use most often to ship products.</SectionIntro>

      {isSignal || SKILLS_LAYOUT === "bento" ? (
        /* Signal theme keeps the original 3-column grid with its shell commands;
           "bento" is the previous default-theme layout. */
        <div className={`mt-8 grid gap-4 sm:grid-cols-2 ${isSignal ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
          {(isSignal
            ? skillGroups.map((group) => ({ group, span: "", dark: false }))
            : BENTO.map(({ key, span, dark = false }) => ({ group: groupOf(key), span, dark }))
          ).map(({ group, span, dark }) => renderTile(group, span, dark))}
        </div>
      ) : (
        /* Two zones. Both sides stretch to the same height and the last tile on
           each side fills what's left, so their bottom edges line up. */
        <SnakeLayer enabled={SHOW_SNAKE} foodIcons={SNAKE_FOOD} className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col">
            <ZoneLabel>Tech stack</ZoneLabel>
            <div className="grid flex-1 gap-4 sm:grid-cols-2 sm:grid-rows-[auto_auto_1fr]">
              {renderTile(groupOf("frontend"))}
              {renderTile(groupOf("backend"))}
              {renderTile(groupOf("languages"))}
              {renderTile(groupOf("devops"))}
              {renderTile(groupOf("tooling"), "sm:col-span-2")}
            </div>
          </div>
          <div className="flex flex-col">
            <ZoneLabel>How I work</ZoneLabel>
            <div className="flex flex-1 flex-col gap-4">
              {renderTile(groupOf("ai"), "", true)}
              {renderTile(groupOf("leadership"))}
              {renderTile(groupOf("remote"), "flex-1")}
            </div>
          </div>
        </SnakeLayer>
      )}

      {!HIDE_EXPLORING && (
        <div className="mt-10 rounded-lg border border-dashed p-5" style={{ borderColor: "var(--border-strong)" }}>
          {isSignal && (
            <p className="mb-2 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
              $ cat roadmap.md --status=exploring
            </p>
          )}
          <h3 className="font-[var(--font-display)] text-sm font-semibold text-[var(--text-primary)]">
            {isSignal ? "// currently exploring" : "Currently exploring"}
          </h3>
          <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-[var(--text-muted)]">
            Not yet used hands-on in production — actively learning as I build out the AI-native
            side of my stack.
          </p>
          <div className="mt-4 space-y-3">
            {exploring.map((group) => (
              <div key={group.category} className="flex flex-wrap items-baseline gap-2">
                <span className="font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]">
                  {group.category}:
                </span>
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded px-2 py-0.5 font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]"
                    style={{ border: "1px dashed var(--border)" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </Band>
  );
}

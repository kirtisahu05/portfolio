"use client";

import { exploring, skills } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";
import { getSkillIcon } from "@/lib/skill-icons";
import { HIDE_EXPLORING } from "@/lib/feature-flags";
import SectionIntro from "@/components/SectionIntro";
import Band from "@/components/Band";
import SectionHeading from "@/components/SectionHeading";

const groups: { key: keyof typeof skills; label: string; cmd: string }[] = [
  { key: "languages", label: "Languages", cmd: "cat stack/languages.txt" },
  { key: "frontend", label: "Frontend", cmd: "ls stack/frontend" },
  { key: "backend", label: "Backend", cmd: "ls stack/backend" },
  { key: "tooling", label: "Testing & PM", cmd: "ls stack/tooling" },
  { key: "devops", label: "DevOps & Tools", cmd: "ls stack/tools" },
  { key: "ai", label: "AI & LLM", cmd: "ls stack/ai" },
  { key: "remote", label: "Remote & Async", cmd: "ls stack/remote" },
];

export default function Skills() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <Band id="skills" tone="cream">
      <SectionHeading
        label="Skills"
        title={"The tools I ship with."}
        signalLabel="skills"
        signalTitle="tree ./stack -L 2"
      />
      <SectionIntro>A compact view of the tools I use most often to ship products.</SectionIntro>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.key}
            className="rounded-lg border p-5"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            {isSignal && (
              <p className="mb-2 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
                {group.cmd}
              </p>
            )}
            <h3 className="mb-3 font-[var(--font-display)] text-sm font-semibold text-[var(--text-primary)]">
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills[group.key].map((skill) => {
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
          </div>
        ))}
      </div>

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

"use client";

import { SiGithub } from "react-icons/si";
import { TbExternalLink, TbLock } from "react-icons/tb";
import { projects, projectsIntro } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";
import { getSkillIcon } from "@/lib/skill-icons";
import SectionIntro from "@/components/SectionIntro";
import Band from "@/components/Band";
import SectionHeading from "@/components/SectionHeading";
import YourBotArchitecture from "@/components/YourBotArchitecture";
import HowAskAIWorks from "@/components/AskAI/HowAskAIWorks";

type Project = (typeof projects)[number];

// Projects whose architecture renders as an interactive diagram in the default theme.
const INTERACTIVE_DIAGRAMS = new Set(["yourbot-rag-platform", "ask-ai-assistant"]);

// Links sit in a footer row, read after the content (title → description →
// stack → architecture → links). Only links that actually work are shown: no
// disabled "live demo", and a private repo gets a badge instead of a source
// link that would 404 for visitors.
function ProjectLinks({ project }: { project: Project }) {
  const link = "inline-flex items-center gap-1.5 font-[var(--font-mono)] text-xs hover:underline";
  return (
    <div
      className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-4"
      style={{ borderColor: "var(--border)" }}
    >
      {project.liveUrl && (
        <a href={project.liveUrl} className={link} style={{ color: "var(--accent)" }}>
          Live demo <TbExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
      {project.sourcePrivate ? (
        <span className="inline-flex items-center gap-1.5 font-[var(--font-mono)] text-xs text-[var(--text-muted)]">
          <TbLock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Private repo · walkthrough on request
        </span>
      ) : (
        project.sourceUrl && (
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link} text-[var(--text-primary)]`}
          >
            <SiGithub className="h-3.5 w-3.5" aria-hidden="true" /> Source code
          </a>
        )
      )}
    </div>
  );
}

export default function Projects() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <Band id="work" tone="sand">
      <SectionHeading
        label="Selected work"
        title={"Things I've built,"}
        emphasis={"end to end."}
        signalLabel="projects"
        signalTitle="ls ./featured-projects"
      />
      <SectionIntro>{projectsIntro}</SectionIntro>

      <div className="mt-8 space-y-4">
        {projects.map((project) => {
          return (
            <div
              key={project.id}
              className="rounded-lg border p-5"
              style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
            >
              {isSignal && (
                <p className="mb-1 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
                  $ open {project.id.replace(/-/g, " ")}
                </p>
              )}
              <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
                {project.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {project.description}
              </p>

              {isSignal && (
                <p className="mb-2 mt-5 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
                  $ cat stack.json
                </p>
              )}
              {/* Signal's "$ cat stack.json" line already spaces this row; the
                  systems theme needs its own top margin. */}
              <div className={`flex flex-wrap gap-1.5 ${isSignal ? "" : "mt-4"}`}>
                {/* Same pill as Experience's tech stack — icon + label. */}
                {project.tags.map((tag) => {
                  const Icon = getSkillIcon(tag);
                  return (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded px-2 py-1 font-[var(--font-mono)] text-[11px] text-[var(--text-secondary)]"
                      style={{ border: "1px solid var(--border)" }}
                    >
                      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                      {tag}
                    </span>
                  );
                })}
              </div>

              {/* YourBot and Ask AI get interactive diagrams in the default
                  theme; the signal theme (and every other project) keeps the
                  chip list. */}
              {!isSignal && project.id === "yourbot-rag-platform" && <YourBotArchitecture />}
              {!isSignal && project.id === "ask-ai-assistant" && <HowAskAIWorks embedded />}

              {project.architecture && (isSignal || !INTERACTIVE_DIAGRAMS.has(project.id)) && (
                <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                  <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                    Architecture
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                    {project.architecture.map((step, i) => (
                      <span key={step} className="flex items-center gap-2">
                        <span
                          className="rounded px-2 py-1 text-[12px] text-[var(--text-secondary)]"
                          style={{ border: "1px solid var(--border)" }}
                        >
                          {step}
                        </span>
                        {i < project.architecture!.length - 1 && (
                          <span aria-hidden="true" className="text-[var(--text-muted)]">
                            →
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.ownership && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                      My ownership
                    </p>
                    <ul className="mt-2 space-y-1 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                      {project.ownership.mine.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                      Backend / AI service
                    </p>
                    <ul className="mt-2 space-y-1 text-[12px] leading-relaxed text-[var(--text-muted)]">
                      {project.ownership.other.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <ProjectLinks project={project} />
            </div>
          );
        })}
      </div>
    </Band>
  );
}

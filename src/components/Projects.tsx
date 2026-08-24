"use client";

import { projects } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";

export default function Projects() {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <section
      id="work"
      className="mx-auto max-w-5xl px-6 py-14"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {isSignal && (
        <p className="mb-2 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">
          projects
        </p>
      )}
      <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
        {isSignal ? "ls ./featured-projects" : "Selected work"}
      </h2>

      <div className="mt-8 space-y-5">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border p-6"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl">
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
              </div>
              <div className="flex shrink-0 gap-2">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    className="rounded-md px-4 py-2 text-center font-[var(--font-mono)] text-xs"
                    style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
                  >
                    live demo
                  </a>
                ) : (
                  <span
                    aria-disabled="true"
                    className="rounded-md px-4 py-2 text-center font-[var(--font-mono)] text-xs opacity-40"
                    style={{ background: "var(--accent)", color: "var(--accent-contrast)", cursor: "not-allowed" }}
                  >
                    live demo
                  </span>
                )}
                <a
                  href={project.sourceUrl || "#"}
                  className="rounded-md border px-4 py-2 text-center font-[var(--font-mono)] text-xs text-[var(--text-primary)]"
                  style={{ borderColor: "var(--border-strong)" }}
                >
                  source code
                </a>
              </div>
            </div>

            {isSignal && (
              <p className="mb-2 mt-5 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">
                $ cat stack.json
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded px-2.5 py-1 font-[var(--font-mono)] text-[11px] text-[var(--text-secondary)]"
                  style={{ border: "1px solid var(--border)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

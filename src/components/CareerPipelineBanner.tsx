"use client";

import Link from "next/link";
import { experience } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";

// Strip above the nav (default theme) that renders the career as a CI pipeline
// run — a nod to the Shippable / JFrog Pipelines years. Stages come straight
// from `experience` (oldest first): past roles have passed, the current one is
// running, and the next thing being explored is queued.
type Stage = { name: string; year: string; status: "passed" | "running" | "queued" };

const STAGES: Stage[] = [
  ...[...experience].reverse().map((e) => ({
    name: e.company.replace(/ (India|Technologies)$/, ""),
    year: e.period.match(/\d{4}/)?.[0] ?? "",
    status: /present/i.test(e.period) ? ("running" as const) : ("passed" as const),
  })),
  { name: "Agentic AI", year: "next", status: "queued" },
];

const current = STAGES.find((s) => s.status === "running");
const passed = STAGES.filter((s) => s.status === "passed").length;

function StatusIcon({ status }: { status: Stage["status"] }) {
  if (status === "passed") return <span className="pipeline-check" aria-hidden="true">✓</span>;
  if (status === "running") return <span className="pipeline-running" aria-hidden="true" />;
  return <span className="pipeline-queued" aria-hidden="true" />;
}

export default function CareerPipelineBanner() {
  const { theme } = useTheme();
  if (theme === "b") return null;

  return (
    <div className="pipeline-banner border-b border-[var(--nav-border)] font-[var(--font-mono)] text-[11px] text-[var(--nav-text)]">
      <div className="page-container flex items-center gap-4 py-2">
        <span className="flex shrink-0 items-center gap-2">
          <span className="pipeline-running" aria-hidden="true" />
          <span className="text-[var(--nav-brand)]">career.yml</span>
          <span className="hidden opacity-60 sm:inline">· pipeline</span>
        </span>

        {/* Full run on wide screens. */}
        <ol aria-label="Career pipeline" className="hidden min-w-0 flex-1 items-center gap-2 xl:flex">
          {STAGES.map((s, i) => (
            <li
              key={s.name}
              className="pipeline-stage flex items-center gap-2 whitespace-nowrap"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {i > 0 && <span className={`pipeline-edge ${s.status === "queued" ? "pipeline-edge--idle" : ""}`} aria-hidden="true" />}
              <StatusIcon status={s.status} />
              <span className={s.status === "running" ? "text-[var(--nav-accent)]" : s.status === "queued" ? "opacity-60" : "text-[var(--nav-brand)]"}>
                {s.name}
              </span>
              <span className="opacity-50">{s.status === "passed" ? `'${s.year.slice(2)}` : s.status === "running" ? "running" : "queued"}</span>
              <span className="sr-only">— {s.status}</span>
            </li>
          ))}
        </ol>

        {/* Summary on narrow screens. */}
        {current && (
          <p className="min-w-0 flex-1 truncate xl:hidden">
            <span className="text-[var(--nav-accent)]">{current.name}</span> running · {passed} stages passed
          </p>
        )}

        <Link
          href="/ask-ai"
          className="shrink-0 whitespace-nowrap text-[var(--nav-accent)] underline-offset-4 hover:underline"
        >
          Ask my AI about it →
        </Link>
      </div>
    </div>
  );
}

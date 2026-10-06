"use client";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  TbBolt,
  TbBooks,
  TbMessageQuestion,
  TbPlayerPause,
  TbPlayerPlay,
  TbShieldCheck,
  TbSparkles,
} from "react-icons/tb";

// Interactive explainer for the Ask AI empty state. Every step describes what
// the code actually does — keep it in sync with src/app/api/ask/route.ts,
// src/lib/ai-knowledge.ts, and src/lib/ai-system-prompt.ts.
const STEPS: { id: string; icon: IconType; title: string; body: string; facts: string[] }[] = [
  {
    id: "ask",
    icon: TbMessageQuestion,
    title: "You ask",
    body: "Your question goes to the server along with the last few turns of the conversation, so follow-ups like “and before that?” still make sense.",
    facts: ["Up to 500 characters", "Last 6 turns of context", "No account needed"],
  },
  {
    id: "guard",
    icon: TbShieldCheck,
    title: "Guardrails",
    body: "Before anything reaches the model, the request is validated and checked against a per-visitor hourly limit — every part of the history is length-capped too.",
    facts: ["Input validation", "Per-IP rate limit", "History length caps"],
  },
  {
    id: "context",
    icon: TbBooks,
    title: "Context assembled",
    body: "The server builds a knowledge base from the same content this site renders — experience, projects, skills, education, and published log posts. Private and draft entries are stripped first. It all fits in the model's context window, so there's no retrieval step: this is context stuffing, not RAG.",
    facts: ["Experience & projects", "Skills & education", "Public log posts only", "Context stuffing, not RAG"],
  },
  {
    id: "model",
    icon: TbSparkles,
    title: "Gemini answers",
    body: "Gemini Flash-Lite answers under a strict system prompt: only from the facts provided, say so plainly when something isn't covered, never guess numbers or dates, and stay on topic.",
    facts: ["Gemini Flash-Lite", "Temperature 0.3", "Grounded answers only", "Off-topic questions declined"],
  },
  {
    id: "stream",
    icon: TbBolt,
    title: "Streams back",
    body: "The answer streams to your browser token by token over a ReadableStream, so you start reading in about a second instead of waiting for the full reply.",
    facts: ["Token streaming", "ReadableStream", "Answer in seconds"],
  },
];

const ADVANCE_MS = 4000;

export default function HowAskAIWorks() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);

  // Start paused for visitors who prefer reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from a media query on mount
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (!playing || hovered) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % STEPS.length), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [active, playing, hovered]);

  const step = STEPS[active];
  const progress = (active / (STEPS.length - 1)) * 100;

  return (
    <section
      aria-labelledby="how-ask-ai-works"
      className="card-dark relative overflow-hidden rounded-[var(--radius-lg)] border p-6 sm:p-8"
      style={{ borderColor: "var(--border)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="section-label">How it works</span>
          <h2
            id="how-ask-ai-works"
            className="mt-3 font-[var(--font-display)] text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl"
          >
            From your question to a grounded answer
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
          className="flex h-9 w-9 items-center justify-center rounded-full border text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          style={{ borderColor: "var(--border-strong)" }}
        >
          {playing ? <TbPlayerPause className="h-4 w-4" aria-hidden="true" /> : <TbPlayerPlay className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      {/* Step rail: a track with a mint fill up to the active step. */}
      <div className="relative mt-8">
        <div
          className="absolute left-[10%] right-[10%] top-6 hidden h-px md:block"
          style={{ background: "var(--border-strong)" }}
          aria-hidden="true"
        >
          <div className="h-full bg-[var(--accent)] transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div role="tablist" aria-label="Ask AI steps" className="relative grid grid-cols-5 gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === active;
            const isDone = i < active;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                id={`ask-step-${s.id}`}
                aria-selected={isActive}
                aria-controls="ask-step-panel"
                onClick={() => setActive(i)}
                className="group flex flex-col items-center gap-2 text-center"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl border transition"
                  style={{
                    background: isActive ? "var(--accent)" : "var(--bg-elevated)",
                    color: isActive ? "var(--accent-contrast)" : isDone ? "var(--accent)" : "var(--text-secondary)",
                    borderColor: isActive ? "var(--accent)" : "var(--border)",
                    boxShadow: isActive ? "0 0 0 6px rgb(154 251 164 / 0.12)" : undefined,
                  }}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-[var(--font-mono)] text-[10px] text-[var(--text-muted)]">0{i + 1}</span>
                <span
                  className={`hidden text-xs font-medium sm:block ${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="ask-step-panel"
        role="tabpanel"
        aria-labelledby={`ask-step-${step.id}`}
        aria-live="polite"
        className="mt-8 rounded-[calc(var(--radius-lg)-0.25rem)] border p-5 sm:p-6"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
          Step 0{active + 1} · {step.title}
        </p>
        <p className="mt-2 text-left text-[15px] leading-relaxed text-[var(--text-secondary)]">{step.body}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {step.facts.map((fact) => (
            <li
              key={fact}
              className="rounded-full border px-3 py-1 font-[var(--font-mono)] text-[11px] text-[var(--text-primary)]"
              style={{ borderColor: "var(--border-strong)" }}
            >
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

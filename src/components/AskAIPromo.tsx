"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { askAiPromo } from "@/lib/content";
import Band from "@/components/Band";
import { SUGGESTED_QUESTIONS } from "@/components/AskAI/SuggestedQuestions";

const MAX_LENGTH = 500; // same cap as the Ask AI page and /api/ask

// Homepage entry point to Ask AI, styled after BotFriday's "Use our software"
// card. Questions aren't answered inline — they open the full /ask-ai page
// (?q=…), which sends the question on arrival.
export default function AskAIPromo() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function ask(question: string) {
    const q = question.trim().slice(0, MAX_LENGTH);
    if (!q) return;
    router.push(`/ask-ai?q=${encodeURIComponent(q)}`);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(value);
  }

  return (
    <Band id="ask-ai" tone="cream">
      <div className="ask-promo relative overflow-hidden rounded-[var(--radius-lg)] border p-8 sm:p-12" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="section-label">{askAiPromo.label}</span>
            <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--text-primary)]">
              {askAiPromo.title}
              <br />
              {askAiPromo.emphasis}
            </h2>
            <p className="mt-4 max-w-xl text-left text-base leading-relaxed text-[var(--text-secondary)]">{askAiPromo.text}</p>
          </div>

          <div>
            <form onSubmit={onSubmit} className="flex items-center gap-2 rounded-full border p-1.5 pl-5" style={{ borderColor: "var(--border-strong)", background: "var(--bg)" }}>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
                maxLength={MAX_LENGTH}
                placeholder={askAiPromo.placeholder}
                aria-label="Ask a question about Kirti"
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />
              <button
                type="submit"
                disabled={!value.trim()}
                className="inline-flex shrink-0 items-center rounded-full bg-[var(--text-primary)] py-2.5 pl-5 pr-2.5 text-sm font-medium text-[var(--bg)] transition hover:opacity-90 disabled:opacity-50"
              >
                {askAiPromo.button}
                {/* Mint dot on a dark button — BotFriday's light-section variant. */}
                <span className="ml-3 h-6 w-6 rounded-full bg-[var(--badge-bg)]" aria-hidden="true" />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => ask(q)}
                  className="rounded-full border px-3 py-1.5 text-left text-xs text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                  style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Band>
  );
}

"use client";

import { useTheme } from "@/lib/theme-context";

const QUESTIONS = [
  "What's his AI/RAG experience?",
  "What has he built at CoffeeWeb?",
  "Has he led engineering teams before?",
  "Is he open to new roles?",
];

export default function SuggestedQuestions({ onSelect }: { onSelect: (question: string) => void }) {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <div className="flex flex-wrap gap-2">
      {QUESTIONS.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelect(q)}
          className="rounded-full border px-3.5 py-2 text-left font-[var(--font-mono)] text-[13px] transition-colors hover:border-[var(--border-strong)]"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
            background: "var(--bg-elevated)",
          }}
        >
          {isSignal ? "> " : ""}
          {q}
        </button>
      ))}
    </div>
  );
}

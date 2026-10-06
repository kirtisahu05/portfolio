"use client";

import { useTheme } from "@/lib/theme-context";

export type ChatMessageData = {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
};

// Turns bare URLs in a reply into links (the assistant is told to answer in
// plain text and write URLs out in full — see ai-system-prompt.ts). Trailing
// punctuation like "." or ")" is kept out of the link.
const URL_RE = /(https?:\/\/[^\s<>"]+[^\s<>".,;:!?)\]'])/g;

function linkify(text: string) {
  return text.split(URL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all underline underline-offset-2"
        style={{ color: "var(--accent)" }}
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

export default function ChatMessage({ role, content, isError }: ChatMessageData) {
  const { theme } = useTheme();
  const isSignal = theme === "b";
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[85%] whitespace-pre-wrap rounded-lg border px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%]"
        style={{
          borderColor: isError ? "#d95b6e" : "var(--border)",
          background: isUser ? "var(--text-primary)" : "var(--bg-elevated)",
          color: isUser ? "var(--bg)" : "var(--text-secondary)",
        }}
      >
        {isSignal && !isUser && (
          <span
            className="mr-1.5 font-[var(--font-mono)] text-[11px]"
            style={{ color: isError ? "#d95b6e" : "var(--accent)" }}
          >
            &gt;
          </span>
        )}
        {isUser ? content : linkify(content)}
      </div>
    </div>
  );
}

"use client";

import { useTheme } from "@/lib/theme-context";

export type ChatMessageData = {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
};

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
        {content}
      </div>
    </div>
  );
}

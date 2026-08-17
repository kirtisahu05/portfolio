"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTheme } from "@/lib/theme-context";

const MAX_LENGTH = 500;

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (message: string) => void;
  disabled: boolean;
}) {
  const { theme } = useTheme();
  const isSignal = theme === "b";
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Re-focus the input once it re-enables (covers both "idle after response"
  // and the initial mount).
  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
        disabled={disabled}
        placeholder={isSignal ? "$ ask anything" : "Ask about Kirti's background..."}
        maxLength={MAX_LENGTH}
        aria-label="Ask a question about Kirti"
        className="flex-1 rounded-md border px-4 py-2.5 text-sm outline-none disabled:opacity-50"
        style={{
          borderColor: "var(--border-strong)",
          background: "var(--bg-elevated)",
          color: "var(--text-primary)",
        }}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="shrink-0 rounded-md px-5 py-2.5 text-sm font-medium disabled:opacity-50"
        style={{ background: "var(--text-primary)", color: "var(--bg)" }}
      >
        {isSignal ? "run" : "Send"}
      </button>
    </form>
  );
}

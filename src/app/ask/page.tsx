"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useTheme } from "@/lib/theme-context";
import ChatMessage from "@/components/AskAI/ChatMessage";
import ChatInput from "@/components/AskAI/ChatInput";
import SuggestedQuestions from "@/components/AskAI/SuggestedQuestions";
import TypingIndicator from "@/components/AskAI/TypingIndicator";

type Message = { role: "user" | "assistant"; content: string; isError?: boolean };

const MAX_HISTORY_TURNS = 6;

function updateLastMessage(prev: Message[], next: Partial<Message>): Message[] {
  const updated = [...prev];
  updated[updated.length - 1] = { ...updated[updated.length - 1], ...next };
  return updated;
}

export default function AskPage() {
  const { theme } = useTheme();
  const isSignal = theme === "b";
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [awaitingFirstToken, setAwaitingFirstToken] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const inputDisabled = isStreaming || isRateLimited;

  async function sendMessage(text: string) {
    const history = messages.map(({ role, content }) => ({ role, content })).slice(-MAX_HISTORY_TURNS);
    setMessages((prev) => [...prev, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setIsStreaming(true);
    setAwaitingFirstToken(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (res.status === 429) {
        setIsRateLimited(true);
        setMessages((prev) =>
          updateLastMessage(prev, {
            content: "You've reached the question limit for now — check back in a few minutes.",
            isError: true,
          })
        );
        return;
      }

      if (!res.ok || !res.body) {
        setMessages((prev) =>
          updateLastMessage(prev, { content: "Something went wrong — try again in a moment.", isError: true })
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value.length > 0) setAwaitingFirstToken(false);
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => updateLastMessage(prev, { content: assistantText }));
      }

      if (!assistantText) {
        setMessages((prev) =>
          updateLastMessage(prev, { content: "Something went wrong — try again in a moment.", isError: true })
        );
      }
    } catch {
      setMessages((prev) =>
        updateLastMessage(prev, { content: "Something went wrong — try again in a moment.", isError: true })
      );
    } finally {
      setIsStreaming(false);
      setAwaitingFirstToken(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-8">
        <p className="mb-1 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">ask ai</p>
        <h1 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
          {isSignal ? "./ask-about-kirti" : "Ask AI about Kirti"}
        </h1>

        <div aria-live="polite" className="mt-6 flex-1 space-y-3">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Ask me anything about Kirti&apos;s background, skills, or experience.
              </p>
              <SuggestedQuestions onSelect={sendMessage} />
            </div>
          ) : (
            <>
              {messages.map((m, i) =>
                awaitingFirstToken && i === messages.length - 1 && m.role === "assistant" && m.content === "" ? (
                  <TypingIndicator key={i} />
                ) : (
                  <ChatMessage key={i} role={m.role} content={m.content} isError={m.isError} />
                )
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--border)" }}>
          <ChatInput onSend={sendMessage} disabled={inputDisabled} />
          {isRateLimited && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Question limit reached for now — refresh and try again later once it resets.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

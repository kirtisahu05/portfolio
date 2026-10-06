"use client";

import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useTheme } from "@/lib/theme-context";
import ChatMessage from "@/components/AskAI/ChatMessage";
import ChatInput from "@/components/AskAI/ChatInput";
import SuggestedQuestions from "@/components/AskAI/SuggestedQuestions";
import TypingIndicator from "@/components/AskAI/TypingIndicator";
import HowAskAIWorks from "@/components/AskAI/HowAskAIWorks";

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
    // Drop failed exchanges — the error bubble and the question it answered —
    // so client-side error text never reaches the model as if it had said it.
    const history = messages
      .filter((m, i) => !m.isError && !messages[i + 1]?.isError)
      .map(({ role, content }) => ({ role, content }))
      .slice(-MAX_HISTORY_TURNS);
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

  // A question handed over from the homepage Ask AI card arrives as ?q=…
  // Send it once, then drop it from the URL so a refresh doesn't re-ask.
  // Read from window.location rather than useSearchParams, which would force
  // this statically rendered page into a Suspense boundary.
  const handedOffRef = useRef(false);
  useEffect(() => {
    if (handedOffRef.current) return;
    handedOffRef.current = true; // guards React's dev double-invoke too
    const q = new URLSearchParams(window.location.search).get("q")?.trim();
    if (!q) return;
    window.history.replaceState(null, "", window.location.pathname);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL on mount is intentional
    void sendMessage(q.slice(0, 500));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  return (
    <>
      <Nav />
      <main className="page-container flex w-full flex-1 flex-col py-8">
        {isSignal ? (
          <>
            <p className="mb-1 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">ask ai</p>
            <h1 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
              ./ask-about-kirti
            </h1>
          </>
        ) : (
          <div className="pt-6">
            <span className="section-label">Ask AI</span>
            <h1 className="mt-4 font-[var(--font-display)] text-3xl font-bold tracking-[-0.03em] text-[var(--text-primary)] sm:text-4xl">
              Ask anything about my work.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              An AI assistant grounded in my experience, projects, and writing — it says so when something isn&apos;t
              covered instead of guessing.
            </p>
          </div>
        )}

        <div aria-live="polite" className="mt-6 flex-1 space-y-3">
          {messages.length === 0 ? (
            <div className="space-y-6">
              <HowAskAIWorks />
              <div>
                <p className="mb-3 text-sm text-[var(--text-secondary)]">
                  Try one of these, or type your own below:
                </p>
                <SuggestedQuestions onSelect={sendMessage} />
              </div>
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

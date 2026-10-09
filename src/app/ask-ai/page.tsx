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

// The conversation survives a refresh: saved to this browser's localStorage
// after each finished answer, restored on load. Per-visitor convenience only —
// it never leaves the browser. Expires after a week, capped in size, and
// "New conversation" clears it (shared computers).
const STORAGE_KEY = "ask-ai-conversation";
const STORAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_STORED_MESSAGES = 40;

function isMessage(m: unknown): m is Message {
  const v = m as Message;
  return (
    !!v &&
    (v.role === "user" || v.role === "assistant") &&
    typeof v.content === "string" &&
    (v.isError === undefined || typeof v.isError === "boolean")
  );
}

function loadConversation(): Message[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (data?.v !== 1 || typeof data.savedAt !== "number" || Date.now() - data.savedAt > STORAGE_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    const messages = Array.isArray(data.messages) ? data.messages.filter(isMessage) : [];
    // An answer cut off mid-stream (tab closed) leaves an empty reply — drop it.
    while (messages.length && messages[messages.length - 1].role === "assistant" && !messages[messages.length - 1].content) {
      messages.pop();
    }
    return messages;
  } catch {
    return []; // storage blocked or corrupt — start fresh
  }
}

function saveConversation(messages: Message[]) {
  try {
    const payload = { v: 1, savedAt: Date.now(), messages: messages.slice(-MAX_STORED_MESSAGES) };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage blocked or full — the chat still works, it just won't survive a refresh.
  }
}

function clearConversation() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked — nothing to clear.
  }
}

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
  // Latest messages for sendMessage — the mount effect sends a handed-off
  // question right after restoring, before a re-render could refresh the closure.
  const messagesRef = useRef<Message[]>([]);
  // A restored conversation shouldn't yank the page down to the bottom on load.
  const skipNextScrollRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
    if (skipNextScrollRef.current) {
      skipNextScrollRef.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save once an answer has finished streaming (never a half-written reply).
  // An empty list isn't saved here — "New conversation" clears storage itself.
  useEffect(() => {
    if (!isStreaming && messages.length > 0) saveConversation(messages);
  }, [messages, isStreaming]);

  const inputDisabled = isStreaming || isRateLimited;

  async function sendMessage(text: string) {
    // Drop failed exchanges — the error bubble and the question it answered —
    // so client-side error text never reaches the model as if it had said it.
    const current = messagesRef.current;
    const history = current
      .filter((m, i) => !m.isError && !current[i + 1]?.isError)
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

  // On load: restore the saved conversation, then — if a question was handed
  // over from the homepage Ask AI card as ?q=… — continue it with that
  // question. The ?q is dropped from the URL so a refresh doesn't re-ask.
  // Read from window.location rather than useSearchParams, which would force
  // this statically rendered page into a Suspense boundary.
  const handedOffRef = useRef(false);
  useEffect(() => {
    if (handedOffRef.current) return;
    handedOffRef.current = true; // guards React's dev double-invoke too
    const restored = loadConversation();
    if (restored.length > 0) {
      messagesRef.current = restored;
      skipNextScrollRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from localStorage on mount is intentional
      setMessages(restored);
    }
    const q = new URLSearchParams(window.location.search).get("q")?.trim();
    if (!q) return;
    window.history.replaceState(null, "", window.location.pathname);
    skipNextScrollRef.current = false; // a new question should scroll into view
    void sendMessage(q.slice(0, 500));
  }, []); // run once on mount

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

        {/* Stays above the conversation too — a question handed over from the
            homepage starts the chat on arrival, and the explainer shouldn't
            vanish with the empty state. Kept outside the aria-live region so
            its auto-advancing steps aren't re-announced during a chat. */}
        <div className="mt-6">
          <HowAskAIWorks />
        </div>

        <div aria-live="polite" className="mt-3 flex-1 space-y-3">
          {messages.length === 0 ? (
            <div className="pt-3">
              <p className="mb-3 text-sm text-[var(--text-secondary)]">
                Try one of these, or type your own below:
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
          {messages.length > 0 && !isStreaming && (
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  clearConversation();
                  setMessages([]);
                }}
                className="font-[var(--font-mono)] text-[11px] text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
              >
                {isSignal ? "$ clear" : "New conversation"}
              </button>
            </div>
          )}
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

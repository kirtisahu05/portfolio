"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const inputStyle = {
  borderColor: "var(--border-strong)",
  background: "var(--bg-elevated)",
  color: "var(--text-primary)",
} as const;

const inputClass = "w-full rounded-md border px-3 py-2 text-sm outline-none";
const labelClass = "mb-1.5 block text-xs font-medium text-[var(--text-secondary)]";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// A function rather than a static object so "date" is today's date at the
// moment a blank form is actually needed — not frozen at module load, which
// would go stale for anyone with the tab open across midnight and then
// resetting via "Add another".
function emptyForm() {
  return {
    title: "",
    date: todayIso(),
    time: "",
    type: "",
    category: "",
    summary: "",
    status: "Draft" as "Draft" | "Published",
    visibility: "Public" as "Public" | "Private",
    content: "",
    externalUrl: "",
    imageUrl: "",
    tags: "",
  };
}

type FormState = ReturnType<typeof emptyForm>;
type Stage = "pin" | "form" | "success";

export default function AddLogClient() {
  const [stage, setStage] = useState<Stage>("pin");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinLoading, setPinLoading] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submitPin(e: FormEvent) {
    e.preventDefault();
    setPinError(null);
    setPinLoading(true);
    try {
      const res = await fetch("/api/log/add-log/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.status === 501) {
        setPinError("Add Log form isn't configured yet.");
      } else if (res.status === 429) {
        setPinError("Too many attempts. Try again later.");
      } else if (!res.ok) {
        setPinError("Incorrect PIN.");
      } else {
        setStage("form");
      }
    } catch {
      setPinError("Something went wrong. Please try again.");
    } finally {
      setPinLoading(false);
    }
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.title || !form.date || !form.type || !form.category || !form.summary || !form.status) {
      setFormError("Title, Date, Type, Category, Summary, and Status are required.");
      return;
    }
    if (!form.content && !form.externalUrl) {
      setFormError("Provide either Content or an External URL.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/log/add-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pin }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.message ?? "Something went wrong. Please try again.");
        return;
      }
      setStage("success");
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (stage === "pin") {
    return (
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
        <p className="mb-1 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">log · add-log</p>
        <h1 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">Enter PIN</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">This form is PIN-gated.</p>

        <form onSubmit={submitPin} className="mt-6 space-y-3">
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            aria-label="PIN"
            className={inputClass}
            style={inputStyle}
          />
          {pinError && <p className="text-sm text-red-500">{pinError}</p>}
          <button
            type="submit"
            disabled={pinLoading || !pin}
            className="w-full rounded-md px-4 py-2.5 text-sm font-medium disabled:opacity-40"
            style={{ background: "var(--text-primary)", color: "var(--bg)" }}
          >
            {pinLoading ? "Checking…" : "Continue"}
          </button>
        </form>
      </main>
    );
  }

  if (stage === "success") {
    return (
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16 text-center">
        <p className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">Added ✓</p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Saved to the sheet and should show up on{" "}
          <Link href="/log" className="underline" style={{ color: "var(--accent)" }}>
            /log
          </Link>{" "}
          within a few seconds.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm());
            setStage("form");
          }}
          className="mt-6 rounded-md border px-4 py-2.5 text-sm font-medium text-[var(--text-primary)]"
          style={{ borderColor: "var(--border-strong)" }}
        >
          Add another
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
      <p className="mb-1 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">log · add-log</p>
      <h1 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">Add an entry</h1>

      <form onSubmit={submitForm} className="mt-6 space-y-4">
        <div>
          <label className={labelClass} htmlFor="title">Title *</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="type">Type *</label>
            <input
              id="type"
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              placeholder="note, log, til..."
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="category">Category *</label>
            <input
              id="category"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="summary">Summary *</label>
          <textarea
            id="summary"
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
            rows={2}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="date">Date *</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="time">Time</label>
            <input
              id="time"
              type="time"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="status">Status *</label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => update("status", e.target.value as "Draft" | "Published")}
              className={inputClass}
              style={inputStyle}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="visibility">Visibility</label>
          <select
            id="visibility"
            value={form.visibility}
            onChange={(e) => update("visibility", e.target.value as "Public" | "Private")}
            className={inputClass}
            style={inputStyle}
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="content">
            Content {!form.externalUrl && "*"}
          </label>
          <textarea
            id="content"
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            rows={10}
            placeholder="Markdown supported — headings, lists, tables, code fences..."
            className={`${inputClass} font-[var(--font-mono)] text-[13px]`}
            style={inputStyle}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="externalUrl">
              External URL {!form.content && "*"}
            </label>
            <input
              id="externalUrl"
              type="url"
              value={form.externalUrl}
              onChange={(e) => update("externalUrl", e.target.value)}
              placeholder="https://…"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="imageUrl">Image URL</label>
            <input
              id="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="https://…"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="tags">Tags</label>
          <input
            id="tags"
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
            placeholder="comma, separated, tags"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {formError && <p className="text-sm text-red-500">{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md px-5 py-2.5 text-sm font-medium disabled:opacity-40"
          style={{ background: "var(--text-primary)", color: "var(--bg)" }}
        >
          {submitting ? "Saving…" : "Add entry"}
        </button>
      </form>
    </main>
  );
}

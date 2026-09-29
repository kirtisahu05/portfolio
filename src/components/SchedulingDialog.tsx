"use client";

import { useEffect, useRef, useState } from "react";
import Terminal from "./Terminal";

// Only the full appointments URL can be framed; Google's short
// calendar.app.google links refuse embedding, so callers open those in a tab.
export function isEmbeddableSchedule(url: string): boolean {
  return /^https:\/\/calendar\.google\.com\/calendar\/appointments\/schedules\//.test(url);
}

function toEmbedUrl(url: string): string {
  const u = new URL(url);
  u.searchParams.set("gv", "true");
  return u.toString();
}

type Props = {
  url: string;
  open: boolean;
  onClose: () => void;
};

export default function SchedulingDialog({ url, open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Clicking the backdrop (the dialog element itself, outside the panel) closes it.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label="Schedule a conversation"
      className="m-auto h-[85vh] w-[min(960px,calc(100vw-32px))] max-w-none rounded-lg border p-0 backdrop:bg-black/50"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
    >
      <div className="flex h-full flex-col">
        <div
          className="flex items-center justify-between border-b px-4 py-2"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="font-[var(--font-mono)] text-[11px] tracking-wide text-[var(--text-muted)]">
            PICK A TIME
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded px-2 py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            ✕
          </button>
        </div>
        {open && <BookingFrame url={url} />}
      </div>
    </dialog>
  );
}

// Mounted only while the dialog is open, so its loaded state resets on every
// open. Google's booking page takes a moment to render — the Terminal loader
// covers the blank frame until the iframe fires onLoad.
function BookingFrame({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative flex-1">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Terminal className="text-2xl" style={{ color: "var(--accent)" }} />
        </div>
      )}
      <iframe
        src={toEmbedUrl(url)}
        title="Book a time on Google Calendar"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full bg-white transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
        style={{ border: 0 }}
      />
    </div>
  );
}

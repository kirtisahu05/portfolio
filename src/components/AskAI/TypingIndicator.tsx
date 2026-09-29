"use client";

import Terminal from "@/components/Terminal";

// Shown in the assistant's bubble until the first streamed token arrives —
// the same Terminal loader used for page loads.
export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="flex items-center rounded-lg border px-4 py-2.5"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        <Terminal className="text-sm" style={{ color: "var(--accent)" }} />
      </div>
    </div>
  );
}

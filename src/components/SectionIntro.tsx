import type { ReactNode } from "react";

// The one-paragraph intro under a section heading. Shared so every section's
// intro has the same width, spacing, and type — they had drifted (max-w-lg vs
// max-w-2xl, mt-2/3/4, with and without leading-relaxed). max-w-2xl because
// the longer intros (Selected work, Why work with me) read as a cramped,
// tall column at max-w-lg.
export default function SectionIntro({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">{children}</p>
  );
}

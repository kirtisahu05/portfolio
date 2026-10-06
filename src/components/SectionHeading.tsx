"use client";

import type { ReactNode } from "react";
import { useTheme } from "@/lib/theme-context";

// Section label + heading for both themes:
//   - default theme: a small monospace pill ("label") above a large heading,
//     with an optional second line in green ("emphasis") — BotFriday style.
//   - signal theme: the original "// label" comment line above a shell-style
//     heading ("signalTitle"), unchanged.
export default function SectionHeading({
  label,
  title,
  emphasis,
  signalLabel,
  signalTitle,
  align = "left",
}: {
  label: string;
  title: ReactNode;
  emphasis?: ReactNode;
  signalLabel: string;
  signalTitle: string;
  align?: "left" | "center";
}) {
  const { theme } = useTheme();

  if (theme === "b") {
    return (
      <>
        <p className="mb-2 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">{signalLabel}</p>
        <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">{signalTitle}</h2>
      </>
    );
  }

  return (
    <div className={align === "center" ? "text-center" : undefined}>
      <span className="section-label">{label}</span>
      <h2 className="mt-4 font-[var(--font-display)] text-[var(--text-primary)]">
        {title}
        {emphasis && (
          <>
            <br />
            <span className="heading-emphasis">{emphasis}</span>
          </>
        )}
      </h2>
    </div>
  );
}

"use client";

import { useTheme } from "@/lib/theme-context";
import { renderInline } from "@/lib/inline-markdown";

export default function BulletList({
  items,
  sign = "+",
  className = "",
}: {
  items: string[];
  sign?: string;
  className?: string;
}) {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--text-secondary)]"
        >
          {isSignal ? (
            <span
              aria-hidden="true"
              className="mt-0.5 shrink-0 font-[var(--font-mono)] text-xs font-semibold"
              style={{ color: "var(--accent)" }}
            >
              {sign}
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: "var(--accent)" }}
            />
          )}
          <span>{renderInline(item)}</span>
        </li>
      ))}
    </ul>
  );
}

import type { CSSProperties } from "react";

// Loading indicator styled as a terminal prompt with a blinking cursor.
// Color comes from currentColor (set `style={{ color }}` or a text-color
// class on the consumer) and size from font-size, same as the demo API this
// was modeled on (`<Terminal className="text-xl" />`).
export default function Terminal({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-flex items-center font-[var(--font-mono)] ${className}`}
      style={style}
    >
      <span aria-hidden="true">&gt;</span>
      <span className="terminal-cursor" aria-hidden="true" />
    </span>
  );
}

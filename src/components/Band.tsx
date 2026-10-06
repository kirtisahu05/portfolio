import type { ReactNode } from "react";

export type BandTone = "cream" | "sand" | "dark";

// A full-width section band with the content column inside. In the default
// theme the tone sets the background (and, for "sand"/"dark", re-points the
// color tokens — see .band-sand / .band-dark in globals.css), giving the
// BotFriday-style alternating rhythm. In the signal theme every tone renders
// the same and bands are separated by a hairline instead.
export default function Band({
  id,
  tone = "cream",
  innerClassName = "py-[var(--section-py)]",
  children,
}: {
  id?: string;
  tone?: BandTone;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`band band-${tone}`}>
      <div className={`mx-auto max-w-5xl px-6 ${innerClassName}`}>{children}</div>
    </section>
  );
}

import { workedWith } from "@/lib/content";
import Band from "@/components/Band";

// Credibility strip — BotFriday's "Trusted by teams at" row, as muted text
// wordmarks. Rendered `embedded` at the bottom of the hero (about) band; the
// standalone cream band is kept for use elsewhere.
export default function WorkedWith({ embedded = false }: { embedded?: boolean }) {
  const content = (
    <>
      <p className="text-center font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {workedWith.label}
      </p>
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        {workedWith.names.map((name) => (
          <li
            key={name}
            className="font-[var(--font-display)] text-lg font-semibold tracking-tight text-[var(--text-muted)] opacity-80"
          >
            {name}
          </li>
        ))}
      </ul>
    </>
  );

  if (embedded) {
    return (
      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="page-container py-8">{content}</div>
      </div>
    );
  }

  return (
    <Band tone="cream" innerClassName="py-10">
      {content}
    </Band>
  );
}

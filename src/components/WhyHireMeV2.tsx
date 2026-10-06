"use client";

import type { IconType } from "react-icons";
import { TbCode, TbHierarchy3, TbRocket, TbSparkles, TbStack2, TbUsers, TbWorld } from "react-icons/tb";
import { whyHireMeV2, whyHireMeV2Intro, whyMeLayout } from "@/lib/content";
import { useTheme } from "@/lib/theme-context";
import SectionIntro from "@/components/SectionIntro";
import Band from "@/components/Band";
import SectionHeading from "@/components/SectionHeading";

// The live "Why work with me" section — replaced the older WhyHireMe, which is
// kept (unrendered) along with its content for the Ask AI knowledge base.

type Card = (typeof whyHireMeV2)[number];

const ICONS: Record<string, IconType> = {
  architecture: TbHierarchy3,
  leadership: TbUsers,
  delivery: TbRocket,
  remote: TbWorld,
  "individual-contributor": TbCode,
  ai: TbSparkles,
};

const byId = (id: string) => whyHireMeV2.find((card) => card.id === id);

// Signal theme: the plain card grid, unchanged.
function SignalWhyMe() {
  return (
    <Band id="why-me" tone="cream">
      <SectionHeading
        label="Why me"
        title="Why work with me"
        signalLabel="why me"
        signalTitle="cat ./value-proposition.md"
      />
      <SectionIntro>
        <span className="font-semibold text-[var(--text-primary)]">{whyHireMeV2Intro.lead}</span>{" "}
        {whyHireMeV2Intro.body}
      </SectionIntro>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {whyHireMeV2.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border p-5"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <p className="mb-2 font-[var(--font-mono)] text-[11px] text-[var(--accent)]">cat {item.file}</p>
            <h3 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{item.description}</p>
          </div>
        ))}
      </div>
    </Band>
  );
}

// Small icon tile used on every card (dark tile on the mint card, translucent
// tile on the dark cards).
function IconTile({ icon: Icon, featured }: { icon: IconType; featured?: boolean }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl ${featured ? "h-12 w-12" : "h-10 w-10 border"}`}
      style={
        featured
          ? { background: "#0a221f", color: "#9afba4" }
          : { background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--accent)" }
      }
    >
      <Icon className={featured ? "h-6 w-6" : "h-5 w-5"} aria-hidden="true" />
    </span>
  );
}

function RowCard({ card }: { card: Card }) {
  return (
    <div
      className="rounded-[var(--radius-lg)] border p-7"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
    >
      <IconTile icon={ICONS[card.id] ?? TbStack2} />
      <h3 className="mt-6 font-[var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">{card.title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">{card.description}</p>
    </div>
  );
}

// Default theme: BotFriday's "The problem" layout — dark band, statement
// heading, one full-width mint feature card, rows of translucent cards, and a
// thin closing strip.
function DefaultWhyMe() {
  const featured = byId(whyMeLayout.featuredId);

  return (
    <Band id="why-me" tone="dark">
      <div className="max-w-3xl">
        <SectionHeading
          label="Why me"
          title={whyHireMeV2Intro.lead}
          signalLabel="why me"
          signalTitle="cat ./value-proposition.md"
        />
        <p className="mt-5 text-left text-base leading-relaxed text-[var(--text-secondary)]">
          I turn product requirements into technical direction, build systems that scale, help teams execute, and stay
          accountable for what happens in production.
        </p>
      </div>

      {featured && (
        <div className="card-mint mt-12 flex flex-col gap-6 rounded-[var(--radius-lg)] p-8 sm:flex-row sm:p-10">
          <IconTile icon={ICONS[featured.id] ?? TbStack2} featured />
          <div>
            <h3 className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {featured.title}
            </h3>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">{featured.description}</p>
          </div>
        </div>
      )}

      {whyMeLayout.rows.map((row) => (
        <div key={row.join("-")} className={`mt-4 grid gap-4 ${row.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
          {row.map((id) => {
            const card = byId(id);
            return card ? <RowCard key={id} card={card} /> : null;
          })}
        </div>
      ))}

      <div
        className="mt-4 flex items-start gap-4 rounded-[var(--radius-lg)] border px-6 py-5"
        style={{ borderColor: "var(--border)" }}
      >
        <TbStack2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
        <p className="text-left text-[15px] leading-relaxed text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">{whyMeLayout.strip.lead}</span> {whyMeLayout.strip.text}
        </p>
      </div>
    </Band>
  );
}

export default function WhyHireMeV2() {
  const { theme } = useTheme();
  return theme === "b" ? <SignalWhyMe /> : <DefaultWhyMe />;
}

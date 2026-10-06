"use client";

import { education } from "@/lib/content";
import BulletList from "./BulletList";
import Band from "@/components/Band";
import SectionHeading from "@/components/SectionHeading";

export default function Education() {
  return (
    <Band id="education" tone="cream">
      <SectionHeading
        label="Education"
        title={"Where it started."}
        signalLabel="education"
        signalTitle="cat ./education.md"
      />
      <div className="mt-8 space-y-4">
        {education.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border p-5"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
                  {item.degree}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">{item.institution}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.board}</p>
              </div>
              <span
                className="whitespace-nowrap rounded-full border px-3 py-1 font-[var(--font-mono)] text-[11px] text-[var(--text-secondary)]"
                style={{ borderColor: "var(--border-strong)" }}
              >
                {item.period}
              </span>
            </div>
            {item.details.length > 0 && (
              <BulletList items={item.details} sign="-" className="mt-3" />
            )}
          </div>
        ))}
      </div>
    </Band>
  );
}

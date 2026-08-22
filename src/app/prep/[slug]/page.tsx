import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Markdown from "@/components/Markdown";
import { getPrepEntryBySlug } from "@/lib/prep-source";
import { toPlainSnippet } from "@/lib/markdown-snippet";
import { profile } from "@/lib/content";

function formatDate(dateIso: string): string {
  const [y, m, d] = dateIso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPrepEntryBySlug(slug);
  if (!entry) return { title: "Not found" };
  return {
    title: entry.title,
    description: toPlainSnippet(entry.content).slice(0, 160),
  };
}

export default async function PrepEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = await getPrepEntryBySlug(slug);

  if (!entry) notFound();

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <Link href="/prep" className="text-sm hover:text-[var(--text-primary)]" style={{ color: "var(--accent)" }}>
          ← Back to Prep
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2 font-[var(--font-mono)] text-[11px]">
          <span style={{ color: "var(--text-muted)" }}>{entry.tabLabel}</span>
          <span
            className="rounded-full px-2 py-0.5"
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            {entry.category}
          </span>
          {entry.tags.map((tag) => (
            <span key={tag} style={{ color: "var(--text-muted)" }}>
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
          {entry.title}
        </h1>

        <p className="mt-2 font-[var(--font-mono)] text-[13px]" style={{ color: "var(--text-muted)" }}>
          {profile.name} · Last updated {formatDate(entry.date)}
        </p>

        {entry.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- external, unknown-dimension sheet-supplied URL
          <img
            src={entry.imageUrl}
            alt=""
            className="mt-6 h-64 w-full rounded-lg object-cover sm:h-80"
            style={{ border: "1px solid var(--border)" }}
          />
        )}

        <div className="mt-8 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          {entry.content ? (
            <Markdown
              content={entry.content}
              className="prep-content max-w-none text-[15px] leading-relaxed text-[var(--text-secondary)]"
            />
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              This topic is hosted elsewhere.{" "}
              {entry.externalUrl && (
                <a
                  href={entry.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: "var(--accent)" }}
                >
                  Read it here ↗
                </a>
              )}
            </p>
          )}
        </div>

        {entry.interviewTakeaway && (
          <div
            className="mt-8 rounded-lg border p-5"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <p className="mb-2 font-[var(--font-mono)] text-[11px] tracking-wide" style={{ color: "var(--accent)" }}>
              interview takeaway
            </p>
            <Markdown
              content={entry.interviewTakeaway}
              className="prep-content max-w-none text-[14px] leading-relaxed text-[var(--text-secondary)]"
            />
          </div>
        )}

        {entry.content && entry.externalUrl && (
          <p className="mt-8 text-xs" style={{ color: "var(--text-muted)" }}>
            Related link:{" "}
            <a
              href={entry.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "var(--accent)" }}
            >
              {entry.externalUrl}
            </a>
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}

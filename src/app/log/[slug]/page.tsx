import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LogContent from "@/components/Log/LogContent";
import { getLogEntryBySlug } from "@/lib/log-source";
import { profile } from "@/lib/content";

const WORDS_PER_MINUTE = 200;

function formatDate(dateIso: string, time: string | null): string {
  const [y, m, d] = dateIso.split("-").map(Number);
  const formatted = new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return time ? `${formatted} · ${time}` : formatted;
}

function readTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getLogEntryBySlug(slug);
  if (!entry) return { title: "Not found" };
  return {
    title: entry.title,
    description: entry.summary,
  };
}

export default async function LogEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = await getLogEntryBySlug(slug);

  if (!entry) notFound();

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <Link href="/log" className="text-sm hover:text-[var(--text-primary)]" style={{ color: "var(--accent)" }}>
          ← Back to Log
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2 font-[var(--font-mono)] text-[11px]">
          <span
            className="rounded-full px-2 py-0.5"
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            {entry.type}
          </span>
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
          {profile.name} · {formatDate(entry.date, entry.time)}
          {entry.content && ` · ${readTime(entry.content)} min read`}
        </p>

        <div className="mt-8 border-t pt-8" style={{ borderColor: "var(--border)" }}>
          {entry.content ? (
            <LogContent content={entry.content} />
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              This entry is hosted elsewhere.{" "}
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

        {entry.content && entry.externalUrl && (
          <p className="mt-8 text-xs" style={{ color: "var(--text-muted)" }}>
            Originally posted at{" "}
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

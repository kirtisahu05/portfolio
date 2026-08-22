"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import type { PrepEntry } from "@/lib/prep-source";
import { PREP_TABS } from "@/lib/prep-tabs";
import { profile } from "@/lib/content";
import PrepCard from "@/components/Prep/PrepCard";
import PrepTabSwitcher from "@/components/Prep/PrepTabSwitcher";
import LogSearch from "@/components/Log/LogSearch";
import LogPagination from "@/components/Log/LogPagination";
import CategoryFilter from "@/components/Log/LogSidebar/CategoryFilter";
import StatsCard from "@/components/Log/LogSidebar/StatsCard";
import ViewSwitcher, { type LogViewMode } from "@/components/Log/ViewSwitcher";

const PAGE_SIZE = 10;
const TAB_STORAGE_KEY = "prep-active-tab";
const VIEW_STORAGE_KEY = "prep-view-mode";
const ENTRIES_CONTAINER_CLASS: Record<LogViewMode, string> = {
  list: "space-y-4",
  magazine: "space-y-6",
  compact: "",
  grid: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
};

export default function PrepPageClient({ entries }: { entries: PrepEntry[] }) {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<LogViewMode>("list");

  useEffect(() => {
    const stored = window.localStorage.getItem(TAB_STORAGE_KEY);
    if (stored && PREP_TABS.some((t) => t.slug === stored)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount is intentional
      setTab(stored);
    }
    const storedView = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (storedView === "list" || storedView === "compact" || storedView === "magazine" || storedView === "grid") {
      setView(storedView);
    }
  }, []);

  function changeTab(next: string | null) {
    setTab(next);
    setCategory(null);
    setPage(1);
    if (next) window.localStorage.setItem(TAB_STORAGE_KEY, next);
    else window.localStorage.removeItem(TAB_STORAGE_KEY);
  }

  function changeView(next: LogViewMode) {
    setView(next);
    window.localStorage.setItem(VIEW_STORAGE_KEY, next);
  }

  const tabFiltered = useMemo(() => (tab ? entries.filter((e) => e.tabSlug === tab) : entries), [entries, tab]);
  const latestTopicNumber =
    tabFiltered.length > 0 ? Math.max(...tabFiltered.map((e) => e.topicNumber)) : -1;

  const categories = useMemo(
    () => Array.from(new Set(tabFiltered.map((e) => e.category))).sort(),
    [tabFiltered]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tabFiltered.filter((e) => {
      if (category && e.category !== category) return false;
      if (q && !e.title.toLowerCase().includes(q) && !e.content.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tabFiltered, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateCategory(value: string | null) {
    setCategory(value);
    setPage(1);
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
      <p className="mb-1 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">prep</p>
      <h1 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
        {isSignal ? "cat ./prep/*.md" : "Prep"}
      </h1>
      <p className="mt-2 max-w-lg text-sm text-[var(--text-secondary)]">
        Topics I&apos;m studying — what they are, why they matter, and what to say in an interview.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-4">
          <PrepTabSwitcher tabs={PREP_TABS} active={tab} onChange={changeTab} />

          <div className="flex items-center justify-between gap-3">
            <ViewSwitcher view={view} onChange={changeView} />
          </div>

          <LogSearch
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
          />

          {entries.length === 0 ? (
            <div
              className="rounded-lg border p-8 text-center text-sm text-[var(--text-muted)]"
              style={{ borderColor: "var(--border)" }}
            >
              Nothing published yet — check back soon.
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="rounded-lg border p-8 text-center text-sm text-[var(--text-muted)]"
              style={{ borderColor: "var(--border)" }}
            >
              No topics match your filters.
            </div>
          ) : (
            <div
              className={ENTRIES_CONTAINER_CLASS[view]}
              style={view === "compact" ? { borderTop: "1px solid var(--border)" } : undefined}
            >
              {pageItems.map((entry) => (
                <PrepCard
                  key={entry.topicNumber}
                  entry={entry}
                  isLatest={entry.topicNumber === latestTopicNumber}
                  view={view}
                />
              ))}
            </div>
          )}

          <LogPagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div
            className="rounded-lg border p-5"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <p className="mb-2 font-[var(--font-mono)] text-[11px] tracking-wide" style={{ color: "var(--accent)" }}>
              about
            </p>
            <h3
              className="font-[var(--font-display)] text-sm font-semibold text-[var(--text-primary)]"
              style={{ textTransform: "none" }}
            >
              {profile.name}
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {profile.role} · {profile.location}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">
              A running set of notes I build for myself while prepping for interviews and going deeper on topics.
            </p>
          </div>

          <StatsCard
            postCount={tabFiltered.length}
            categoryCount={categories.length}
            itemLabel="topic"
            itemLabelPlural="topics"
          />
          <CategoryFilter categories={categories} active={category} onChange={updateCategory} />
        </aside>
      </div>
    </main>
  );
}

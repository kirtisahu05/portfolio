"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import type { ListEntry, LogEntry } from "@/lib/log-source";
import LogCard from "@/components/Log/LogCard";
import LogFilter from "@/components/Log/LogFilter";
import LogSearch from "@/components/Log/LogSearch";
import LogPagination from "@/components/Log/LogPagination";
import ViewSwitcher, { type LogViewMode } from "@/components/Log/ViewSwitcher";
import AboutCard from "@/components/Log/LogSidebar/AboutCard";
import StatsCard from "@/components/Log/LogSidebar/StatsCard";
import CategoryFilter from "@/components/Log/LogSidebar/CategoryFilter";

const PAGE_SIZE = 10;
const VIEW_STORAGE_KEY = "log-view-mode";
const ENTRIES_CONTAINER_CLASS: Record<LogViewMode, string> = {
  list: "space-y-4",
  magazine: "space-y-6",
  compact: "",
  grid: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3",
};

export default function LogPageClient({ entries }: { entries: ListEntry[] }) {
  const { theme } = useTheme();
  const isSignal = theme === "b";

  const [search, setSearch] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<LogViewMode>("list");

  useEffect(() => {
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "list" || stored === "compact" || stored === "magazine" || stored === "grid") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount is intentional
      setView(stored);
    }
  }, []);

  function changeView(next: LogViewMode) {
    setView(next);
    window.localStorage.setItem(VIEW_STORAGE_KEY, next);
  }

  const publicEntries = useMemo(
    () => entries.filter((e): e is LogEntry => e.visibility === "Public"),
    [entries]
  );
  const types = useMemo(() => Array.from(new Set(publicEntries.map((e) => e.type))).sort(), [publicEntries]);
  const categories = useMemo(
    () => Array.from(new Set(publicEntries.map((e) => e.category))).sort(),
    [publicEntries]
  );
  const latestLogNumber = entries.length > 0 ? Math.max(...entries.map((e) => e.logNumber)) : -1;

  // Private entries carry no type/category to filter by, so they only show
  // up in the unfiltered "All" view — once a type or category filter is
  // active they drop out rather than appearing in every filtered result.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filteringActive = !!type || !!category;
    return entries.filter((e) => {
      if (e.visibility === "Private") {
        if (filteringActive) return false;
        if (q && !e.title.toLowerCase().includes(q)) return false;
        return true;
      }
      if (type && e.type !== type) return false;
      if (category && e.category !== category) return false;
      if (q && !e.title.toLowerCase().includes(q) && !e.summary.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [entries, type, category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateFilter(setter: (v: string | null) => void, value: string | null) {
    setter(value);
    setPage(1);
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
      <p className="mb-1 font-[var(--font-mono)] text-xs tracking-wide text-[var(--accent)]">log</p>
      <h1 className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
        {isSignal ? "cat ./logs/*.md" : "Log"}
      </h1>
      <p className="mt-2 max-w-lg text-sm text-[var(--text-secondary)]">
        Notes, writing, and things worth remembering.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-4">
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
          <LogFilter types={types} active={type} onChange={(v) => updateFilter(setType, v)} />

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
              No entries match your search or filters.
            </div>
          ) : (
            <div
              className={ENTRIES_CONTAINER_CLASS[view]}
              style={view === "compact" ? { borderTop: "1px solid var(--border)" } : undefined}
            >
              {pageItems.map((entry) => (
                <LogCard
                  key={entry.logNumber}
                  entry={entry}
                  isLatest={entry.logNumber === latestLogNumber}
                  view={view}
                />
              ))}
            </div>
          )}

          <LogPagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <AboutCard />
          <StatsCard postCount={entries.length} categoryCount={categories.length} />
          <CategoryFilter categories={categories} active={category} onChange={(v) => updateFilter(setCategory, v)} />
        </aside>
      </div>
    </main>
  );
}

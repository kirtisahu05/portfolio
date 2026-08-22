export type PrepTab = {
  slug: string;
  label: string;
  gid: string;
};

// One entry per Google Sheet tab to pull into /prep. To add a new tab: click
// it at the bottom of the sheet, copy the number after `#gid=` in the
// browser's address bar, and add a row below — no other code changes needed.
// `label` is just what shows in the UI tab strip; rename freely.
export const PREP_TABS: PrepTab[] = [
  { slug: "topics", label: "Topics", gid: "0" },
  { slug: "ai", label: "AI", gid: "129638619" },
  { slug: "react", label: "React", gid: "838875975" },
  { slug: "js", label: "JS", gid: "551953404" },
  { slug: "system-design", label: "System Design", gid: "1977653959" },
  { slug: "lld", label: "LLD", gid: "28777499" },
  { slug: "frontend", label: "Frontend", gid: "1542534022" },
];

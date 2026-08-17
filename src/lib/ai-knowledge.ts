import {
  education,
  experience,
  exploring,
  professionalAbilities,
  profile,
  projects,
  skills,
  whyHireMe,
} from "@/lib/content";
import type { LogEntry } from "@/lib/log-source";

function formatDate(dateIso: string): string {
  const [y, m, d] = dateIso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Same source the Log page renders from (getLogEntries) — already filtered to
// Published entries only. Passed in rather than fetched here so this module
// stays synchronous; the route awaits getLogEntries() once and threads it
// through.
export function buildLogKnowledgeBase(logEntries: LogEntry[]): string {
  if (logEntries.length === 0) return "";

  return [
    "# Log entries (Kirti's personal log — notes, writing, and things worth remembering; not limited to work)",
    ...logEntries.map((entry) =>
      [
        `## ${entry.title} (${entry.category} · ${entry.type} · ${formatDate(entry.date)})`,
        `Summary: ${entry.summary}`,
        entry.content ? `Content: ${entry.content}` : "",
        entry.externalUrl ? `Published externally: ${entry.externalUrl}` : "",
        entry.tags.length > 0 ? `Tags: ${entry.tags.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    ),
  ].join("\n\n");
}

// Builds the knowledge base fed to the "Ask AI About Me" assistant, assembled
// entirely from content.ts — the same single source of truth the site renders
// from — plus published Log entries. Update content.ts or publish a log entry
// and this updates automatically; no duplicate upkeep.
export function buildKnowledgeBase(logEntries: LogEntry[] = []): string {
  const sections: string[] = [];

  sections.push(
    [
      "# About",
      `Name: ${profile.name}`,
      `Role: ${profile.role}`,
      `Location: ${profile.location}`,
      `Email: ${profile.email}`,
      `Bio: ${profile.bio}`,
    ].join("\n")
  );

  sections.push(
    [
      "# Why hire him",
      ...whyHireMe.map((item) => `- ${item.title}: ${item.description}`),
    ].join("\n")
  );

  sections.push(
    [
      "# Professional abilities",
      ...professionalAbilities.map((item) => `- ${item}`),
    ].join("\n")
  );

  sections.push(
    [
      "# Experience",
      ...experience.map((job) =>
        [
          `## ${job.role}, ${job.company} (${job.period})`,
          job.companyProfile ? `Company: ${job.companyProfile}` : "",
          job.project ? `Project: ${job.project}` : "",
          job.techStack.length > 0 ? `Tech stack: ${job.techStack.join(", ")}` : "",
          ...job.bullets.map((bullet) => `- ${bullet}`),
        ]
          .filter(Boolean)
          .join("\n")
      ),
    ].join("\n\n")
  );

  sections.push(
    [
      "# Education",
      ...education.map(
        (item) => `- ${item.degree}, ${item.institution} — ${item.board} (${item.period})`
      ),
    ].join("\n")
  );

  sections.push(
    [
      "# Skills — core (hands-on, production experience)",
      `Languages: ${skills.languages.join(", ")}`,
      `Frontend: ${skills.frontend.join(", ")}`,
      `Backend: ${skills.backend.join(", ")}`,
      `DevOps & Tools: ${skills.devops.join(", ")}`,
      `AI & LLM: ${skills.ai.join(", ")}`,
      `Remote & Async: ${skills.remote.join(", ")}`,
      `Testing & PM: ${skills.tooling.join(", ")}`,
    ].join("\n")
  );

  sections.push(
    [
      "# Skills — currently exploring (NOT hands-on production experience — do not claim expertise here, only that he is actively learning it)",
      ...exploring.map((group) => `${group.category}: ${group.items.join(", ")}`),
    ].join("\n")
  );

  sections.push(
    [
      "# Projects",
      ...projects.map(
        (p) => `- ${p.title} (${p.tags.join(", ")}): ${p.description}`
      ),
    ].join("\n")
  );

  const logSection = buildLogKnowledgeBase(logEntries);
  if (logSection) sections.push(logSection);

  return sections.join("\n\n");
}

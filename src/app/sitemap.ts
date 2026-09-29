import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getLogEntries, type LogEntry } from "@/lib/log-source";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Public entries only — private ones have no page (and no slug) to list.
  const logEntries = (await getLogEntries()).filter((e): e is LogEntry => e.visibility === "Public");

  // Only entries with Content get an on-site page; external-only entries
  // link straight out to where they're hosted.
  const logPages: MetadataRoute.Sitemap = logEntries
    .filter((entry) => entry.content)
    .map((entry) => ({
      url: `${siteUrl}/log/${entry.slug}`,
      lastModified: entry.date,
      changeFrequency: "yearly",
      priority: 0.5,
    }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/log`,
      lastModified: logEntries[0]?.date ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/ask-ai`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...logPages,
  ];
}

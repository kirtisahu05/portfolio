import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { getThemeInitScript } from "@/lib/theme-script";
import { profile } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import { MULTI_UI_ENABLED } from "@/lib/feature-flags";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Derived from profile.role rather than hardcoded, so the title/JSON-LD
// jobTitle can't drift out of sync with the headline shown in the Hero (see
// portfolio review point 7 — inconsistent titles across the site/resume).
const title = `${profile.name} — ${profile.role}`;
const description =
  "Lead Software Engineer & Frontend Architect building production web platforms with React, Next.js, and TypeScript — now extending into AI-native engineering.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s — ${profile.name}`,
  },
  description,
  keywords: [
    "Kirti Kumar Sahu",
    "Lead Software Engineer",
    "Frontend Architect",
    "Software Architect",
    "React",
    "Next.js",
    "TypeScript",
    "Frontend Engineering",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  // No canonical here — a layout-level canonical is inherited by every route,
  // which would tell search engines /log, /ask-ai, and each log post are
  // duplicates of the homepage. Each page sets its own (relative paths resolve
  // against metadataBase).
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.location,
  },
  sameAs: [
    profile.links.github,
    profile.links.linkedin,
    profile.links.medium,
    profile.links.youtube,
  ].filter(Boolean),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="a"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript(MULTI_UI_ENABLED) }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

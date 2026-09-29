import type { Metadata } from "next";

// page.tsx is a client component and can't export metadata, so /ask-ai's
// title and canonical live here.
export const metadata: Metadata = {
  title: "Ask AI",
  description: "Ask an AI assistant about Kirti Kumar Sahu's experience, skills, projects, and writing.",
  alternates: { canonical: "/ask-ai" },
};

export default function AskLayout({ children }: LayoutProps<"/ask-ai">) {
  return children;
}

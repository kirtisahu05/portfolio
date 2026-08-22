import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PrepPageClient from "@/components/Prep/PrepPageClient";
import { getPrepEntries } from "@/lib/prep-source";

export const metadata: Metadata = {
  title: "Prep",
  description: "Interview prep topics — what they are, why they matter, and what to say.",
};

export default async function PrepPage() {
  const entries = await getPrepEntries();

  return (
    <>
      <Nav />
      <PrepPageClient entries={entries} />
      <Footer />
    </>
  );
}

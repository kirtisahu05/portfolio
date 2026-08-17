import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LogPageClient from "@/components/Log/LogPageClient";
import { getLogEntries } from "@/lib/log-source";

export const metadata: Metadata = {
  title: "Log",
  description: "Notes, writing, and things worth remembering.",
};

export default async function LogPage() {
  const entries = await getLogEntries();

  return (
    <>
      <Nav />
      <LogPageClient entries={entries} />
      <Footer />
    </>
  );
}

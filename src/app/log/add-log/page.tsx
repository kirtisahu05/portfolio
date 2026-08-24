import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AddLogClient from "@/components/Log/AddLogClient";

export const metadata: Metadata = {
  title: "Add Log — Log",
  robots: { index: false, follow: false },
};

export default function AddLogPage() {
  return (
    <>
      <Nav />
      <AddLogClient />
      <Footer />
    </>
  );
}

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Terminal from "@/components/Terminal";

// Root-level loading UI (same Terminal loader as dev-base) — shown for any
// route switch that has to wait on the server, e.g. a /log/[slug] post
// fetching from the sheet. Pages render their own Nav/Footer, so the loading
// state does too, keeping the frame steady while the content loads.
export default function Loading() {
  return (
    <>
      <Nav />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-24">
        <Terminal className="text-3xl" style={{ color: "var(--accent)" }} />
      </main>
      <Footer />
    </>
  );
}

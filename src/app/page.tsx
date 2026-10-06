import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WhyHireMeV2 from "@/components/WhyHireMeV2";
import WorkedWith from "@/components/WorkedWith";
import AskAIPromo from "@/components/AskAIPromo";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="about" className="min-w-0 flex-1">
        <Hero />
        <WorkedWith />
        <Skills />
        <Experience />
        <Education />
        <Projects />
        <WhyHireMeV2 />
        <AskAIPromo />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

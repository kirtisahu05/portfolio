import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WhyHireMe from "@/components/WhyHireMe";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="about" className="min-w-0 flex-1">
        <Hero />
        <Skills />
        <Experience />
        <Education />
        <Projects />
        <WhyHireMe />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

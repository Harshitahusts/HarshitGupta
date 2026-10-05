import SiteNav from "@/components/portfolio/SiteNav";
import Hero from "@/components/portfolio/Hero";
import Experience from "@/components/portfolio/Experience";
import Projects from "@/components/portfolio/Projects";
import Skills from "@/components/portfolio/Skills";
import Contact from "@/components/portfolio/Contact";
import { useRevealOnScroll, useSpotlight } from "@/components/portfolio/hooks";

/**
 * One compact page: Hero → Experience → Projects → Toolkit → Contact.
 * The ambient background is decorative CSS; every piece of content is real HTML.
 */
function App() {
  useRevealOnScroll();
  useSpotlight();
  return (
    <>
      <a className="skip-link" href="#experience">
        Skip to content
      </a>
      <div className="ambient" aria-hidden />
      <div className="grain" aria-hidden />
      <SiteNav />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
      </main>
      <Contact />
    </>
  );
}

export default App;

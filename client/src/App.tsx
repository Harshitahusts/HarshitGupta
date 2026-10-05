import SiteNav from "@/components/portfolio/SiteNav";
import SceneCanvas from "@/components/portfolio/SceneCanvas";
import Hero from "@/components/portfolio/Hero";
import Experience from "@/components/portfolio/Experience";
import Projects from "@/components/portfolio/Projects";
import Skills from "@/components/portfolio/Skills";
import Contact from "@/components/portfolio/Contact";
import { useRevealOnScroll, useSpotlight } from "@/components/portfolio/hooks";

/**
 * One compact page: Hero → Experience → Projects → Toolkit → Contact.
 * The 3D scene is a fixed, decorative background; every piece of content is real HTML.
 */
function App() {
  useRevealOnScroll();
  useSpotlight();
  return (
    <>
      <a className="skip-link" href="#experience">
        Skip to content
      </a>
      <SceneCanvas />
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

import SiteNav from "@/components/portfolio/SiteNav";
import Journey from "@/components/portfolio/Journey";
import CaseStudies from "@/components/portfolio/CaseStudies";
import Thinking from "@/components/portfolio/Thinking";
import Experience from "@/components/portfolio/Experience";
import About from "@/components/portfolio/About";
import Contact from "@/components/portfolio/Contact";
import { useRevealOnScroll } from "@/components/portfolio/hooks";

/**
 * Information architecture — "The journey of a product":
 *   Hero → Journey (Idea · Discover · Define · Build · Launch · Measure · Iterate · Next)
 *   → Work (case studies) → How I think → Experience → About → Contact
 * The 3D scene is progressive enhancement; every piece of content is real HTML.
 */
function App() {
  useRevealOnScroll();
  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      <SiteNav />
      <main>
        <Journey />
        <CaseStudies />
        <Thinking />
        <Experience />
        <About />
      </main>
      <Contact />
    </>
  );
}

export default App;

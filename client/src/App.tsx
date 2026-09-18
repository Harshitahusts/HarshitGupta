import { useEffect, useState, type CSSProperties, type PointerEvent } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleArrowOutUpRight,
  Code2,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  FileDown,
  Mail,
  Menu,
  MoveUpRight,
  Orbit,
  Phone,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";

type Project = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  live: string;
  repo: string;
  details: string[];
  accent: "lime" | "coral";
};

const projects: Project[] = [
  {
    number: "01",
    eyebrow: "Live product · 2025",
    title: "Sarathi",
    description:
      "A focused school-commute experience designed around trust, coordination, and fewer daily decisions for families.",
    tags: ["Product thinking", "UX flows", "React"],
    live: "https://sarathi-school-commute.vercel.app/",
    repo: "https://github.com/Harshitahusts/sarathi-school-commute",
    details: [
      "Mapped the commute journey into clear, confidence-building steps.",
      "Balanced parent needs, driver coordination, and a calmer daily workflow.",
      "Shipped a live product surface with a public GitHub repository for iteration.",
    ],
    accent: "lime",
  },
];

const professionalRoles = [
  {
    number: "01",
    company: "Kratikal Tech Pvt. Ltd.",
    role: "Associate Product Manager",
    period: "Jan 2025 — now",
    description: "Leading AutoSecT product strategy, AI security verification, MSSP expansion, and enterprise delivery.",
    outcomes: ["$12.5K MRR influenced", "35% faster crawls", "40% fewer false positives"],
  },
  {
    number: "02",
    company: "BoloForms",
    role: "Product Management Intern",
    period: "May — Jul 2024",
    description: "Improved PDF rendering performance and workflow efficiency for a product serving 20K+ users.",
    outcomes: ["4s → 100ms rendering", "20K+ users", "$10K MRR expansion"],
  },
];

const skills = [
  "Product strategy",
  "GTM & pricing",
  "AI / RAG systems",
  "Customer discovery",
  "SQL analytics",
  "Experimentation",
  "Cybersecurity SaaS",
  "Enterprise delivery",
];

function BrandMark() {
  return (
    <a className="brand-mark" href="#top" aria-label="Back to top">
      <span className="brand-mark__dot" />
      <span>HG</span>
    </a>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a className="social-link" href={href} target="_blank" rel="noreferrer" aria-label={label}>
      {icon}
    </a>
  );
}

function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  const handleOrbMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: y * -12 });
  };

  const resetOrb = () => setTilt({ x: 0, y: 0 });

  return (
    <div className="portfolio-shell" id="top">
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <header className="site-header">
        <div className="header-inner">
          <BrandMark />
          <nav className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
            <a href="#work" onClick={() => setMenuOpen(false)}>Personal projects</a>
            <a href="#career" onClick={() => setMenuOpen(false)}>Professional career</a>
            <a href="#approach" onClick={() => setMenuOpen(false)}>Approach</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a className="nav-cta" href="https://www.linkedin.com/in/harshit-gupta-316b35229/" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>
              Let&apos;s talk <ArrowUpRight size={15} />
            </a>
          </nav>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero container">
          <div className="hero-copy reveal-up">
            <div className="eyebrow"><span className="eyebrow-dot" /> Associate Product Manager · India</div>
            <h1>
              I turn complex systems into <em>clear momentum.</em>
            </h1>
            <p className="hero-intro">
              Harshit Gupta is a product manager building AI-driven B2B SaaS and cybersecurity products across 0→1 and growth stages.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#work">Personal projects <ArrowDownRight size={17} /></a>
              <a className="text-link" href="https://www.linkedin.com/in/harshit-gupta-316b35229/" target="_blank" rel="noreferrer">Open LinkedIn <ExternalLink size={15} /></a>
              <a className="text-link" href="/resume.pdf" target="_blank" rel="noreferrer">Download résumé <FileDown size={15} /></a>
            </div>
            <div className="hero-meta">
              <div><span className="meta-value">01+</span><span className="meta-label">years shipping</span></div>
              <div><span className="meta-value">$12.5K</span><span className="meta-label">MRR influenced</span></div>
              <div><span className="meta-value">35%</span><span className="meta-label">faster crawls</span></div>
            </div>
          </div>

          <div className="hero-orbit-wrap reveal-up" style={{ animationDelay: "140ms" }}>
            <div className="hero-orbit" onPointerMove={handleOrbMove} onPointerLeave={resetOrb} style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}>
              <div className="orbit-grid" />
              <div className="orbit-ring orbit-ring--outer" />
              <div className="orbit-ring orbit-ring--inner" />
              <div className="orbit-core"><Orbit size={38} strokeWidth={1.2} /></div>
              <div className="orbit-node orbit-node--one"><Sparkles size={15} /><span>insight</span></div>
              <div className="orbit-node orbit-node--two"><Target size={15} /><span>focus</span></div>
              <div className="orbit-node orbit-node--three"><Zap size={15} /><span>velocity</span></div>
              <div className="orbit-caption"><span>01</span><span>Product as a system</span></div>
            </div>
            <div className="orbit-note"><span className="orbit-note__line" />Hover the field</div>
          </div>
        </section>

        <section className="signal-strip">
          <div className="container signal-strip__inner">
            <span>Currently building at Kratikal Tech</span>
            <span className="signal-strip__rule" />
            <span>AI security · SaaS · product strategy</span>
            <span className="signal-strip__pulse" />
          </div>
        </section>

        <section className="work-section container" id="work">
          <div className="section-heading reveal-up">
            <div><span className="section-index">01 /</span><span className="section-kicker">Personal projects</span></div>
            <p>A small set of products where I turned a real user problem into a clearer, calmer experience.</p>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <article className={`project-card project-card--${project.accent} reveal-up`} style={{ animationDelay: `${index * 120}ms` }} key={project.number}>
                <div className="project-card__topline"><span>{project.number}</span><span>{project.eyebrow}</span></div>
                <div className="project-card__body">
                  <div className="project-card__copy">
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <div className="tag-row">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                  </div>
                  <div className="project-visual" aria-hidden="true">
                    <div className="project-visual__glow" />
                    <div className="project-visual__shape project-visual__shape--back" />
                    <div className="project-visual__shape project-visual__shape--front"><span>{project.number}</span></div>
                    <div className="project-visual__label">{project.accent === "lime" ? "carefully / connected" : "secure / intelligent"}</div>
                  </div>
                </div>
                <div className="project-card__footer">
                  <button className="case-link" onClick={() => setActiveProject(project)}>Open case study <ChevronRight size={16} /></button>
                  <div className="project-links">
                    <a href={project.live} target="_blank" rel="noreferrer">Live product <ExternalLink size={14} /></a>
                    <a href={project.repo} target="_blank" rel="noreferrer">GitHub repo <Github size={14} /></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="career-section" id="career">
          <div className="container career-grid">
            <div className="career-heading reveal-up">
              <span className="section-index">02 /</span>
              <h2>Professional<br /><em>career.</em></h2>
              <p>Experience across AI security, B2B SaaS, growth, and enterprise product delivery.</p>
              <a className="button button--secondary" href="/resume.pdf" target="_blank" rel="noreferrer"><FileDown size={15} /> Read the résumé</a>
            </div>
            <div className="career-list reveal-up">
              {professionalRoles.map((role) => (
                <article className="career-card" key={role.company}>
                  <div className="career-card__top"><span className="career-card__number">{role.number}</span><span className="timeline-date">{role.period}</span></div>
                  <h3>{role.role}</h3>
                  <p className="career-card__company">{role.company}</p>
                  <p className="career-card__description">{role.description}</p>
                  <div className="career-outcomes">{role.outcomes.map((outcome) => <span key={outcome}>{outcome}</span>)}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="approach-section" id="approach">
          <div className="container approach-grid">
            <div className="approach-heading reveal-up">
              <span className="section-index">03 /</span>
              <h2>Less noise.<br /><em>More signal.</em></h2>
              <p>My operating system for moving from a fuzzy problem to a product people choose.</p>
            </div>
            <div className="principles reveal-up">
              <div className="principle"><span>01</span><div><h3>Find the sharp edge</h3><p>Customer discovery, telemetry, and a clear ICP turn assumptions into a decision worth making.</p></div><Target size={19} /></div>
              <div className="principle"><span>02</span><div><h3>Make complexity legible</h3><p>From RAG pipelines to security workflows, I translate technical depth into product clarity.</p></div><Code2 size={19} /></div>
              <div className="principle"><span>03</span><div><h3>Ship the learning loop</h3><p>Build, measure, learn. Every release should make the next product decision more obvious.</p></div><Zap size={19} /></div>
            </div>
          </div>
        </section>

        <section className="about-section container" id="about">
          <div className="section-heading reveal-up">
            <div><span className="section-index">04 /</span><span className="section-kicker">The short version</span></div>
            <p>A product mind with a technical spine and a bias toward making the important thing easier to see.</p>
          </div>
          <div className="about-grid">
            <div className="about-statement reveal-up"><span className="quote-mark">“</span><p>I like products that respect people&apos;s attention—and teams that respect the problem before racing to the solution.</p></div>
            <div className="about-details reveal-up">
              <div className="timeline-item"><span className="timeline-dot" /><div><span className="timeline-date">Jan 2025 — now</span><h3>Associate Product Manager · Kratikal Tech</h3><p>Leading product strategy, AI security verification, and MSSP expansion.</p></div></div>
              <div className="timeline-item"><span className="timeline-dot" /><div><span className="timeline-date">May — Jul 2024</span><h3>Product Management Intern · BoloForms</h3><p>Improved rendering latency from 4s to 100ms for 20K+ users.</p></div></div>
              <div className="timeline-item"><span className="timeline-dot" /><div><span className="timeline-date">May 2023 — Jan 2024</span><h3>Technical Lead · GDSC MNIT Jaipur</h3><p>Led a 120+ member community focused on AI and applied software.</p></div></div>
            </div>
          </div>
          <div className="skills-block reveal-up"><span className="skills-label">Working toolkit</span><div className="skills-list">{skills.map((skill) => <span key={skill}>{skill}<Check size={14} /></span>)}</div></div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container contact-inner reveal-up">
            <span className="section-index">05 / contact</span>
            <h2>Have a hard product<br /><em>problem?</em> Let&apos;s talk.</h2>
            <div className="contact-actions"><a className="button button--primary button--large" href="mailto:guptaharshit619@gmail.com">Email me <Mail size={18} /></a><a className="button contact-button-dark" href="tel:+919522012835">Call +91 95220 12835 <Phone size={17} /></a></div>
            <div className="contact-details"><a href="mailto:guptaharshit619@gmail.com"><Mail size={15} /> guptaharshit619@gmail.com</a><a href="tel:+919522012835"><Phone size={15} /> +91 9522012835</a></div>
            <div className="contact-footer"><span>Harshit Gupta · APM</span><div className="socials"><SocialLink href="https://github.com/Harshitahusts" label="GitHub" icon={<Github size={17} />} /><SocialLink href="https://www.linkedin.com/in/harshit-gupta-316b35229/" label="LinkedIn" icon={<Linkedin size={17} />} /><SocialLink href="https://x.com/Harshit54283" label="X" icon={<span className="x-icon">𝕏</span>} /></div><span>© 2025</span></div>
          </div>
        </section>
      </main>

      {activeProject && (
        <div className="modal-backdrop" role="presentation" onClick={() => setActiveProject(null)}>
          <section className="case-modal" role="dialog" aria-modal="true" aria-labelledby="case-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveProject(null)} aria-label="Close case study"><X size={19} /></button>
            <span className="section-index">{activeProject.number} / case study</span>
            <h2 id="case-title">{activeProject.title}</h2>
            <p className="case-modal__intro">{activeProject.description}</p>
            <div className="case-points">{activeProject.details.map((detail) => <div key={detail}><Check size={16} /><span>{detail}</span></div>)}</div>
            <div className="modal-actions"><a className="button button--primary" href={activeProject.live} target="_blank" rel="noreferrer">Open live product <ExternalLink size={15} /></a><a className="button button--secondary" href={activeProject.repo} target="_blank" rel="noreferrer">View repository <Github size={15} /></a></div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;

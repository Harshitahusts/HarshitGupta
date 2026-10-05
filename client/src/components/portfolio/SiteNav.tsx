import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { LINKS } from "@/content";

const items = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.classList.add("menu-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}
    >
      <div className="nav__bar">
        <a
          className="nav__brand"
          href="#top"
          onClick={close}
          aria-label="Harshit Gupta, back to top"
        >
          <span className="nav__mark" aria-hidden>
            HG
          </span>
          <span className="nav__name">Harshit Gupta</span>
        </a>
        <nav id="primary-nav" className="nav__links" aria-label="Primary">
          {items.map(i => (
            <a key={i.href} href={i.href} onClick={close}>
              {i.label}
            </a>
          ))}
          <a
            href={LINKS.resume}
            target="_blank"
            rel="noreferrer"
            onClick={close}
          >
            Résumé
          </a>
          <a className="nav__cta" href="#contact" onClick={close}>
            Let’s talk <ArrowUpRight size={14} aria-hidden />
          </a>
        </nav>
        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
        </button>
        <span
          className="nav__progress"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden
        />
      </div>
    </header>
  );
}

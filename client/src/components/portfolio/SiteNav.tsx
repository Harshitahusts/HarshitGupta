import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { LINKS } from "@/content";

const items = [
  { href: "#work", label: "Work" },
  { href: "#journey", label: "Journey" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="nav__inner">
        <a className="nav__brand" href="#top" onClick={close}>
          <span className="nav__dot" aria-hidden />
          Harshit Gupta
        </a>
        <nav id="primary-nav" className="nav__links" aria-label="Primary">
          {items.map((i) => (
            <a key={i.href} href={i.href} onClick={close}>
              {i.label}
            </a>
          ))}
          <a href={LINKS.resume} target="_blank" rel="noreferrer" onClick={close}>
            Résumé
          </a>
          <a className="nav__cta" href="#contact" onClick={close}>
            Contact <ArrowUpRight size={14} aria-hidden />
          </a>
        </nav>
        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </div>
    </header>
  );
}

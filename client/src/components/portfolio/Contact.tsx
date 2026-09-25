import { useState } from "react";
import { ArrowUpRight, Check, Copy, FileText, Github, Linkedin, Mail, Phone } from "lucide-react";
import { LINKS } from "@/content";
import { useMagnetic } from "./hooks";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const mag = useMagnetic<HTMLAnchorElement>();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.emailLabel);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = LINKS.email;
    }
  };

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <p className="contact__pre" data-reveal>
          That’s how I build. That’s how I think.
        </p>
        <h2 id="contact-title" className="contact__title" data-reveal>
          Let’s build <em>the next one.</em>
        </h2>
        <div className="cta-row" data-reveal>
          <a ref={mag} className="btn btn--primary btn--lg" href={LINKS.email}>
            Email me <Mail size={17} aria-hidden />
          </a>
          <a className="btn btn--ghost btn--lg" href={LINKS.linkedin} target="_blank" rel="noreferrer">
            Connect on LinkedIn <ArrowUpRight size={16} aria-hidden />
          </a>
          <a className="btn btn--ghost btn--lg" href={LINKS.resume} target="_blank" rel="noreferrer">
            View résumé <FileText size={16} aria-hidden />
          </a>
        </div>
        <div className="contact__details" data-reveal>
          <button className="contact__copy" onClick={copy} aria-live="polite">
            {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
            {copied ? "Email copied" : LINKS.emailLabel}
          </button>
          <a href={LINKS.phone}>
            <Phone size={14} aria-hidden /> {LINKS.phoneLabel}
          </a>
        </div>
      </div>

      <footer className="footer">
        <div className="container footer__inner">
          <span>Harshit Gupta · Product Manager</span>
          <ul className="footer__social">
            <li>
              <a href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github size={16} aria-hidden />
              </a>
            </li>
            <li>
              <a href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin size={16} aria-hidden />
              </a>
            </li>
            <li>
              <a href={LINKS.x} target="_blank" rel="noreferrer" aria-label="X (Twitter)">
                <span className="x-glyph" aria-hidden>
                  𝕏
                </span>
              </a>
            </li>
          </ul>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </section>
  );
}

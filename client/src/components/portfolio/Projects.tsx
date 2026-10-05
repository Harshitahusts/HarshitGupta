import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content";

export default function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">
            <span className="eyebrow__n">02</span> Projects
          </p>
          <h2 className="section-title" id="projects-title">
            Built end to end, <em>on my own.</em>
          </h2>
        </header>

        <div className="projects">
          {projects.map((p, i) => (
            <article
              key={p.id}
              className={`project spot project--${p.id}`}
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
              aria-labelledby={`${p.id}-name`}
            >
              <div className="project__head">
                <p className="project__kicker">{p.kicker}</p>
                <h3 className="project__name" id={`${p.id}-name`}>
                  {p.name}
                </h3>
                <p className="project__title">{p.title}</p>
              </div>
              <p className="project__body">{p.body}</p>
              <ul className="project__points">
                {p.points.map(pt => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <dl className="project__stats">
                {p.stats.map(s => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="project__links">
                {p.links.map(l => (
                  <a
                    key={l.href}
                    className="chip-link"
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.label} <ArrowUpRight size={13} aria-hidden />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

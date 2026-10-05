import { experience, education } from "@/content";

export default function Experience() {
  return (
    <section
      className="section"
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">
            <span className="eyebrow__n">01</span> Experience
          </p>
          <h2 className="section-title" id="experience-title">
            Where I’ve <em>shipped.</em>
          </h2>
        </header>

        <ol className="roles">
          {experience.map((r, i) => (
            <li
              key={r.company}
              className="role spot"
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="role__meta">
                <span className="role__period">{r.period}</span>
                <span className="role__place">{r.place}</span>
              </div>
              <div className="role__main">
                <h3 className="role__company">
                  {r.company}
                  {r.product && (
                    <span className="role__product">{r.product}</span>
                  )}
                </h3>
                <p className="role__title">{r.role}</p>
                <ul className="role__points">
                  {r.points.map(p => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <ul className="tags" aria-label="Focus areas">
                  {r.tags.map(t => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <p className="edu" data-reveal>
          <span className="edu__label">Education</span>
          <span>
            {education.degree} · <strong>{education.school}</strong>
          </span>
          <span className="edu__period">{education.period}</span>
        </p>
      </div>
    </section>
  );
}

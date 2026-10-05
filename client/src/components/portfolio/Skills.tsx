import { skills } from "@/content";

export default function Skills() {
  return (
    <section
      className="section section--tight"
      id="skills"
      aria-labelledby="skills-title"
    >
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">
            <span className="eyebrow__n">03</span> Toolkit
          </p>
          <h2 className="section-title" id="skills-title">
            Strategy, <em>with a technical spine.</em>
          </h2>
        </header>
        <div className="skills">
          {skills.map((g, i) => (
            <div
              key={g.group}
              className="skill spot"
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <h3 className="skill__group">{g.group}</h3>
              <ul className="tags">
                {g.items.map(s => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

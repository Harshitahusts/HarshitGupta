import { FileText } from "lucide-react";
import { experience, LINKS } from "@/content";

export default function Experience() {
  return (
    <section className="experience" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="kicker">Experience</p>
          <h2 id="experience-title" className="section-title">
            Milestones, <em>not a résumé dump.</em>
          </h2>
          <p className="section-lede">
            What the problem space was, what I owned, and what changed.{" "}
            <a className="inline-link" href={LINKS.resume} target="_blank" rel="noreferrer">
              Full résumé <FileText size={13} aria-hidden />
            </a>
          </p>
        </header>

        <ol className="milestones">
          {experience.map((e) => (
            <li key={e.company} className="milestone" data-reveal>
              <div className="milestone__when">
                <span>{e.period}</span>
                <span>{e.place}</span>
              </div>
              <div className="milestone__body">
                <h3>
                  {e.role} <span>· {e.company}</span>
                </h3>
                <dl>
                  <div>
                    <dt>Problem space</dt>
                    <dd>{e.space}</dd>
                  </div>
                  <div>
                    <dt>Owned</dt>
                    <dd>{e.owned}</dd>
                  </div>
                </dl>
                {e.changed.length > 0 && (
                  <ul className="chips" aria-label="What changed">
                    {e.changed.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

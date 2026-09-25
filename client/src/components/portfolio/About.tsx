import { achievements, capabilities } from "@/content";

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="kicker">About</p>
          <h2 id="about-title" className="section-title">
            The short <em>version.</em>
          </h2>
        </header>

        <div className="about__grid">
          <blockquote className="about__quote" data-reveal>
            <p>
              I like products that respect people’s attention — and teams that respect the problem before racing to the
              solution.
            </p>
          </blockquote>
          <div className="about__text" data-reveal>
            <p>
              I studied Chemical Engineering at MNIT Jaipur and found my way into product by building — leading the
              technical team at Google Developer Student Clubs and publicly documenting a 100 Days of Code challenge.
            </p>
            <p>
              Today I work where AI meets cybersecurity. I stay close to engineering — technical solutioning,
              architecture walkthroughs, requirement tooling — and turn that into decisions leadership and customers can
              act on.
            </p>
            <p>
              What I’m exploring: how to evaluate LLM and RAG systems honestly, and where AI should — and shouldn’t —
              make decisions. Sarathi’s rule is the one I keep coming back to: <em>AI flags and explains; humans decide.</em>
            </p>
          </div>
        </div>

        <div className="capabilities" data-reveal>
          <p className="capabilities__lead">
            Turning ambiguous problems into products. <span>Supported by:</span>
          </p>
          <ul>
            {capabilities.map((c, i) => (
              <li key={c.name} style={{ ["--i" as string]: i }}>
                <span className="capabilities__name">{c.name}</span>
                <span className="capabilities__proof">{c.proof}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="achievements" data-reveal aria-label="Other achievements">
          {achievements.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

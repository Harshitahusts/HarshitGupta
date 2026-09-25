import { useId, useState } from "react";
import { ArrowUpRight, ChevronDown, ExternalLink, FileText, Github } from "lucide-react";
import { autosect, boloforms, LINKS, sarathi, type StoryStep } from "@/content";
import FindingsFlow from "./FindingsFlow";

function Story({ steps, preview = 3 }: { steps: StoryStep[]; preview?: number }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const first = steps.slice(0, preview);
  const rest = steps.slice(preview);
  const row = (s: StoryStep, i: number) => (
    <li key={s.label} className="story__step">
      <span className="story__n">{String(i + 1).padStart(2, "0")}</span>
      <span className="story__label">{s.label}</span>
      <p className="story__text">{s.text}</p>
    </li>
  );
  return (
    <div className="story">
      <ol className="story__list">{first.map(row)}</ol>
      {rest.length > 0 && (
        <>
          {/* Collapsed steps stay in the DOM (inert) so the full story is crawlable. */}
          <div className={`story__more ${open ? "is-open" : ""}`} id={id} inert={!open}>
            <div>
              <ol className="story__list" start={preview + 1}>
                {rest.map((s, i) => row(s, i + preview))}
              </ol>
            </div>
          </div>
          <button className="story__toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
            {open ? "Show less" : `Read the full story · ${steps.length} steps`}
            <ChevronDown size={15} aria-hidden className={open ? "is-flipped" : ""} />
          </button>
        </>
      )}
    </div>
  );
}

function CustodyChain() {
  return (
    <figure className="custody">
      <ol className="custody__chain">
        {sarathi.custody.map((c, i) => (
          <li key={c} style={{ ["--i" as string]: i }}>
            <span className="custody__node" aria-hidden />
            <span className="custody__name">{c}</span>
            {i < sarathi.custody.length - 1 && <span className="custody__tick">Handoff {i + 1} · logged + confirmed</span>}
          </li>
        ))}
      </ol>
      <figcaption>
        Four custody transfers in one school day. Each gets a system record plus an independent human confirmation, with
        a manual escalation path if a record is missing.
      </figcaption>
    </figure>
  );
}

function LatencyBars() {
  return (
    <figure className="latency" aria-label="PDF render latency, drawn to scale">
      <div className="latency__row">
        <span className="latency__label">Before</span>
        <span className="latency__track">
          <span className="latency__bar latency__bar--before" style={{ width: "100%" }} />
        </span>
        <span className="latency__val">4,000 ms</span>
      </div>
      <div className="latency__row">
        <span className="latency__label">After</span>
        <span className="latency__track">
          <span className="latency__bar latency__bar--after" style={{ width: "2.5%" }} />
        </span>
        <span className="latency__val">100 ms</span>
      </div>
      <figcaption>Drawn to scale. Async rendering + lazy loading, for 20K+ users.</figcaption>
    </figure>
  );
}

export default function CaseStudies() {
  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="kicker">Selected work</p>
          <h2 id="work-title" className="section-title">
            Three products. <em>Told as product stories.</em>
          </h2>
          <p className="section-lede">
            Each starts with the problem, not the feature — then the users, the decision, what shipped and what moved.
          </p>
        </header>

        {/* ---------------- AutoSecT ---------------- */}
        <article className="case case--flagship" id="case-autosect" aria-labelledby="autosect-title">
          <div className="case__head" data-reveal>
            <p className="case__kicker">{autosect.kicker}</p>
            <h3 id="autosect-title" className="case__title">
              {autosect.title}
            </h3>
            <p className="case__question">{autosect.question}</p>
            <p className="case__summary">{autosect.summary}</p>
            <p className="case__meta">
              Role · {autosect.role}. Professional work — no public product or repository links.
            </p>
          </div>
          <div data-reveal>
            <FindingsFlow />
          </div>
          <dl className="outcomes" data-reveal>
            {autosect.outcomes.map((o) => (
              <div key={o.label}>
                <dt>{o.value}</dt>
                <dd>{o.label}</dd>
              </div>
            ))}
          </dl>
          <div data-reveal>
            <Story steps={autosect.story} preview={4} />
          </div>
        </article>

        {/* ---------------- Sarathi ---------------- */}
        <article className="case" id="case-sarathi" aria-labelledby="sarathi-title">
          <div className="case__head" data-reveal>
            <p className="case__kicker">{sarathi.kicker}</p>
            <h3 id="sarathi-title" className="case__title">
              {sarathi.title}
            </h3>
            <p className="case__question">{sarathi.question}</p>
            <p className="case__summary">{sarathi.summary}</p>
            <div className="case__links">
              <a className="btn btn--primary btn--sm" href={LINKS.sarathiLive} target="_blank" rel="noreferrer">
                Open live prototype <ExternalLink size={14} aria-hidden />
              </a>
              <a className="btn btn--ghost btn--sm" href={LINKS.sarathiRepo} target="_blank" rel="noreferrer">
                GitHub repository <Github size={14} aria-hidden />
              </a>
              <a className="btn btn--ghost btn--sm" href={LINKS.sarathiDoc} target="_blank" rel="noreferrer">
                Product design doc <FileText size={14} aria-hidden />
              </a>
            </div>
          </div>

          <div className="users" data-reveal>
            <p className="mini-label">Four users, four different jobs</p>
            <ul>
              {sarathi.users.map((u, i) => (
                <li key={u.name} style={{ ["--i" as string]: i }}>
                  <span className="users__name">{u.name}</span>
                  <span className="users__job">{u.job}</span>
                </li>
              ))}
            </ul>
          </div>

          <blockquote className="insight" data-reveal>
            <span className="mini-label">Insight</span>
            <p>{sarathi.insight}</p>
          </blockquote>

          <div data-reveal>
            <CustodyChain />
          </div>

          <div className="priorities" data-reveal>
            <p className="mini-label">Prioritised by harm avoided, not revenue</p>
            <div className="priorities__grid">
              {sarathi.priorities.map((p) => (
                <div key={p.tier} className={`priorities__col priorities__col--${p.tier === "P0" ? "p0" : p.tier === "P1" ? "p1" : "never"}`}>
                  <span className="priorities__tier">{p.tier}</span>
                  <ul>
                    {p.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal>
            <Story steps={sarathi.story} preview={3} />
          </div>

          <div className="targets" data-reveal>
            <p className="mini-label">North star · Weekly Verified Safe Handoffs</p>
            <dl>
              {sarathi.targets.map((t) => (
                <div key={t.label}>
                  <dt>{t.value}</dt>
                  <dd>{t.label}</dd>
                </div>
              ))}
            </dl>
            <p className="targets__note">
              Pilot thresholds defined in the design document — targets, not results. The prototype has four surfaces:{" "}
              {sarathi.surfaces.join(" · ")}.
            </p>
          </div>
        </article>

        {/* ---------------- BoloForms ---------------- */}
        <article className="case case--compact" id="case-boloforms" aria-labelledby="boloforms-title">
          <div className="case__head" data-reveal>
            <p className="case__kicker">{boloforms.kicker}</p>
            <h3 id="boloforms-title" className="case__title">
              {boloforms.title}
            </h3>
            <p className="case__question">{boloforms.question}</p>
            <p className="case__summary">{boloforms.summary}</p>
          </div>
          <div className="case__split">
            <div data-reveal>
              <LatencyBars />
            </div>
            <div data-reveal>
              <Story steps={boloforms.story} preview={4} />
            </div>
          </div>
        </article>

        <p className="work__foot" data-reveal>
          More of my work lives on{" "}
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={13} aria-hidden />
          </a>
        </p>
      </div>
    </section>
  );
}

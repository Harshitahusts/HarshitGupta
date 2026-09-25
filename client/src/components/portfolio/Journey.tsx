import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { chapters, LINKS, type Chapter } from "@/content";
import { useCountUp, useInView, useMagnetic, usePrefersReducedMotion } from "./hooks";

const JourneyCanvas = lazy(() => import("./JourneyCanvas"));

function Metric({ m, go }: { m: NonNullable<Chapter["metrics"]>[number]; go: boolean }) {
  const v = useCountUp(m.value, go, m.decimals ?? 0);
  return (
    <div className="metric">
      <div className="metric__value">
        {m.from && <span className="metric__from">{m.from}</span>}
        {m.prefix}
        {v}
        {m.suffix}
      </div>
      <div className="metric__label">{m.label}</div>
      <div className="metric__source">{m.source}</div>
    </div>
  );
}

function MetricField({ metrics }: { metrics: NonNullable<Chapter["metrics"]> }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, "-20% 0px");
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (seen) setGo(true);
  }, [seen]);
  return (
    <div className="metric-field" ref={ref}>
      {metrics.map((m) => (
        <Metric key={m.label} m={m} go={go} />
      ))}
    </div>
  );
}

function ChapterBody({ c }: { c: Chapter }) {
  if (c.id === "define") {
    const spec = [
      ["Problem", "Findings a security team can’t trust are findings it can’t act on."],
      ["User", "MSSPs — the ICP — and the enterprise teams they serve."],
      ["Goal", "Enter new security-service markets with a platform built for them."],
      ["Constraints", "Enterprise GTM priorities; scan performance at client scale."],
      ["Success metric", "Activation · adoption · scan success rate · enterprise expansion."],
    ];
    return (
      <dl className="spec" aria-label="AutoSecT, defined">
        <div className="spec__head">AutoSecT, defined</div>
        {spec.map(([k, v]) => (
          <div className="spec__row" key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (c.id === "discover" || c.id === "launch") {
    return (
      <ul className={`signals signals--${c.id}`} aria-label={c.id === "discover" ? "Signals" : "Launch loop"}>
        {c.signals!.map((s, i) => (
          <li key={s} style={{ ["--i" as string]: i }}>
            {s}
          </li>
        ))}
      </ul>
    );
  }
  if (c.id === "iterate") {
    return (
      <ol className="versions" aria-label="How AutoSecT's verification evolved">
        {c.signals!.map((s, i) => (
          <li key={s} style={{ ["--i" as string]: i }}>
            <span className="versions__v">v{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
    );
  }
  if (c.metrics) return <MetricField metrics={c.metrics} />;
  return null;
}

function Evidence({ c }: { c: Chapter }) {
  if (!c.evidence?.length) return null;
  return (
    <ul className="evidence">
      {c.evidence.map((e) => (
        <li key={e.text}>
          <span className="evidence__text">{e.text}</span>
          <span className="evidence__source">{e.source}</span>
        </li>
      ))}
    </ul>
  );
}

function NextCtas() {
  const mag = useMagnetic<HTMLAnchorElement>();
  return (
    <div className="cta-row">
      <a ref={mag} className="btn btn--primary" href="#work">
        View my work <ArrowDownRight size={16} aria-hidden />
      </a>
      <a className="btn btn--ghost" href={LINKS.resume} target="_blank" rel="noreferrer">
        View résumé <FileText size={15} aria-hidden />
      </a>
      <a className="btn btn--ghost" href={LINKS.linkedin} target="_blank" rel="noreferrer">
        Connect on LinkedIn <ArrowUpRight size={15} aria-hidden />
      </a>
    </div>
  );
}

export default function Journey() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [inJourney, setInJourney] = useState(true);
  const railBarRef = useRef<HTMLDivElement>(null);
  // Continuous stage value is pushed to the scene directly — no React re-render per scroll frame.
  const listeners = useRef(new Set<(s: number) => void>());
  const stageRef = useRef(0);
  const subscribe = useRef((fn: (s: number) => void) => {
    listeners.current.add(fn);
    fn(stageRef.current);
    return () => {
      listeners.current.delete(fn);
    };
  }).current;
  const primary = useMagnetic<HTMLAnchorElement>();

  // Map scroll position → continuous stage value, using the centres of each step.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const steps = Array.from(wrap.querySelectorAll<HTMLElement>("[data-step]"));
    let raf = 0;
    const measure = () => {
      raf = 0;
      const vh = window.innerHeight;
      const probe = vh * 0.5;
      const centres = steps.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      let s = 0;
      if (probe <= centres[0]) s = 0;
      else if (probe >= centres[centres.length - 1]) s = centres.length - 1;
      else {
        for (let i = 0; i < centres.length - 1; i++) {
          if (probe >= centres[i] && probe < centres[i + 1]) {
            s = i + (probe - centres[i]) / (centres[i + 1] - centres[i]);
            break;
          }
        }
      }
      stageRef.current = s;
      listeners.current.forEach((fn) => fn(s));
      setActiveStep(Math.round(s));
      railBarRef.current?.style.setProperty("--p", String(Math.min(Math.max((s - 1) / 7, 0), 1)));
      const wr = wrap.getBoundingClientRect();
      setInJourney(wr.bottom > 0 && wr.top < vh);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const railVisible = inJourney && activeStep >= 1;

  return (
    <div className="journey" ref={wrapRef} id="journey-root">
      <div className="journey__sticky">
        <Suspense fallback={null}>
          <JourneyCanvas subscribe={subscribe} active={inJourney} reducedMotion={reducedMotion} />
        </Suspense>
      </div>

      <nav className={`stage-rail ${railVisible ? "is-visible" : ""}`} aria-label="Product journey stages">
        <ol>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a
                href={`#stage-${c.id}`}
                className={activeStep === i + 1 ? "is-active" : activeStep > i + 1 ? "is-past" : ""}
                aria-current={activeStep === i + 1 ? "step" : undefined}
              >
                <span className="stage-rail__n">{c.index}</span>
                <span className="stage-rail__l">{c.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="stage-rail__bar" ref={railBarRef} />
      </nav>

      <div className="journey__content">
        <section className="hero step" data-step="0" id="top" aria-labelledby="hero-title">
          <div className="container">
            <p className="eyebrow">
              <span className="dot" aria-hidden /> Harshit Gupta · Associate Product Manager
            </p>
            <h1 id="hero-title" className="hero__title">
              <span className="line">Products don’t start with features.</span>
              <span className="line line--accent">They start with problems.</span>
            </h1>
            <p className="hero__lede">
              Hi, I’m Harshit. I build products from <strong>problem</strong> → <strong>insight</strong> →{" "}
              <strong>product</strong> → <strong>impact</strong> — currently in AI-driven cybersecurity at Kratikal Tech.
            </p>
            <div className="cta-row">
              <a ref={primary} className="btn btn--primary" href="#work">
                Explore my work <ArrowDownRight size={16} aria-hidden />
              </a>
              <a className="btn btn--ghost" href={LINKS.resume} target="_blank" rel="noreferrer">
                View résumé <FileText size={15} aria-hidden />
              </a>
              <a className="btn btn--ghost" href={LINKS.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight size={15} aria-hidden />
              </a>
            </div>
            <dl className="proof">
              <div>
                <dt>$12.5K</dt>
                <dd>MRR from scan-based pricing</dd>
              </div>
              <div>
                <dt>−40%</dt>
                <dd>false positives, AI verification</dd>
              </div>
              <div>
                <dt>4s → 100ms</dt>
                <dd>render time for 20K+ users</dd>
              </div>
            </dl>
          </div>
          <a className="scroll-cue" href="#stage-idea">
            <span>Follow a product from idea to impact</span>
            <ArrowDown size={14} aria-hidden />
          </a>
        </section>

        <section className="chapters" id="journey" aria-label="The journey of a product">
          <h2 className="sr-only">The journey of a product</h2>
          {chapters.map((c, i) => (
            <article
              key={c.id}
              id={`stage-${c.id}`}
              data-step={i + 1}
              className={`chapter step chapter--${c.id} ${activeStep === i + 1 ? "is-active" : ""}`}
              aria-labelledby={`stage-${c.id}-title`}
            >
              <div className="container">
                <div className="chapter__panel">
                  <p className="chapter__index">
                    <span>{c.index}</span> {c.label}
                  </p>
                  <h3 id={`stage-${c.id}-title`} className="chapter__title">
                    {c.headline} <em>{c.accent}</em>
                  </h3>
                  <p className="chapter__body">{c.body}</p>
                  <ChapterBody c={c} />
                  <Evidence c={c} />
                  {c.id === "next" && <NextCtas />}
                  {c.id !== "next" && i === 0 && (
                    <a className="skip-journey" href="#work">
                      Skip the journey — go to the work <ArrowRight size={13} aria-hidden />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

import { useRef } from "react";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { hero, LINKS, metrics, type Metric } from "@/content";
import { useCountUp, useInView, useMagnetic } from "./hooks";

function Stat({ m, start, i }: { m: Metric; start: boolean; i: number }) {
  const v = useCountUp(m.value, start, m.decimals ?? 0, 1400 + i * 150);
  return (
    <li className="stat" style={{ "--i": i } as React.CSSProperties}>
      <span className="stat__value">
        {m.prefix}
        {v}
        {m.suffix}
      </span>
      <span className="stat__label">{m.label}</span>
    </li>
  );
}

export default function Hero() {
  const statsRef = useRef<HTMLUListElement>(null);
  const inView = useInView(statsRef);
  const primary = useMagnetic<HTMLAnchorElement>();

  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <p
          className="pill hero__anim"
          style={{ "--d": 0 } as React.CSSProperties}
        >
          <span className="pulse" aria-hidden />
          {hero.now}
        </p>

        <h1 className="hero__title">
          <span className="hero__line">
            <span
              className="hero__word"
              style={{ "--d": 1 } as React.CSSProperties}
            >
              Harshit
            </span>{" "}
            <span
              className="hero__word"
              style={{ "--d": 2 } as React.CSSProperties}
            >
              Gupta
            </span>
          </span>
          <span className="hero__line hero__line--sub">
            <span
              className="hero__word"
              style={{ "--d": 3 } as React.CSSProperties}
            >
              builds products
            </span>{" "}
            <span
              className="hero__word"
              style={{ "--d": 4 } as React.CSSProperties}
            >
              <em>from zero to one.</em>
            </span>
          </span>
        </h1>

        <p
          className="hero__role hero__anim"
          style={{ "--d": 5 } as React.CSSProperties}
        >
          {hero.role}
        </p>
        <p
          className="hero__summary hero__anim"
          style={{ "--d": 6 } as React.CSSProperties}
        >
          {hero.summary}
        </p>

        <div
          className="cta-row hero__anim"
          style={{ "--d": 7 } as React.CSSProperties}
        >
          <a
            ref={primary}
            className="btn btn--primary"
            href={LINKS.resume}
            target="_blank"
            rel="noreferrer"
          >
            <Download size={16} aria-hidden /> Résumé
          </a>
          <a className="btn btn--ghost" href="#contact">
            Get in touch <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>

        <ul
          ref={statsRef}
          className={`stats ${inView ? "is-in" : ""}`}
          aria-label="Outcomes"
        >
          {metrics.map((m, i) => (
            <Stat key={m.label} m={m} start={inView} i={i} />
          ))}
        </ul>
      </div>
      <a
        className="hero__scroll"
        href="#experience"
        aria-label="Scroll to experience"
      >
        <ArrowDown size={16} aria-hidden />
      </a>
    </section>
  );
}

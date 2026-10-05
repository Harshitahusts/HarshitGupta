import { useEffect, useRef } from "react";
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

/**
 * Pixel portrait. As the page scrolls it drifts up, shrinks, tilts and fades away;
 * the nav avatar takes over once it is gone. Pointer tilt on fine pointers only.
 */
function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const away = Math.min(
        Math.max(window.scrollY / (window.innerHeight * 0.75), 0),
        1
      );
      el.style.setProperty("--away", reduced ? "0" : away.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const fine = window.matchMedia("(pointer: fine)").matches && !reduced;
    const onPointer = (e: PointerEvent) => {
      el.style.setProperty(
        "--tx",
        (e.clientX / window.innerWidth - 0.5).toFixed(3)
      );
      el.style.setProperty(
        "--ty",
        (e.clientY / window.innerHeight - 0.5).toFixed(3)
      );
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (fine)
      window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div ref={ref} className="portrait" aria-hidden="true">
      <div className="portrait__float">
        <div className="portrait__card">
          <img
            src="/harshit.jpg"
            alt=""
            width={360}
            height={360}
            decoding="async"
            fetchPriority="high"
          />
          <span className="portrait__shine" />
        </div>
        <span className="portrait__badge">
          <span className="pulse" /> Open to PM roles
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  const statsRef = useRef<HTMLUListElement>(null);
  const inView = useInView(statsRef);
  const primary = useMagnetic<HTMLAnchorElement>();

  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <Portrait />
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

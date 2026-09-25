import { useEffect, useRef } from "react";
import { autosect } from "@/content";
import { useInView } from "./hooks";

/**
 * A stream of findings enters on the left and is progressively verified.
 * Findings that fail a gate (false positives) fall away in the warm colour;
 * what reaches the right is an explained, actionable insight.
 * Illustrative only — particle counts are not data.
 */
export default function FindingsFlow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrapRef, "100px");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !inView) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gates = autosect.pipeline.length;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    type P = { x: number; y: number; v: number; fail: number; dead: boolean; vy: number; a: number };
    const ps: P[] = [];
    const spawn = () => {
      // Each finding is "destined" to fail at some gate or survive (gates index = survives).
      const roll = Math.random();
      const fail = roll < 0.28 ? 1 : roll < 0.48 ? 2 : roll < 0.62 ? 3 : roll < 0.7 ? 4 : gates;
      ps.push({ x: -4, y: h * (0.2 + Math.random() * 0.6), v: w * (0.11 + Math.random() * 0.05), fail, dead: false, vy: 0, a: 1 });
    };
    const gateX = (i: number) => (w * (i + 0.5)) / gates;

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      acc += dt;
      while (acc > 0.032) {
        spawn();
        acc -= 0.032;
      }
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < gates; i++) {
        const x = gateX(i);
        ctx.strokeStyle = "rgba(236,235,228,0.12)";
        ctx.setLineDash([2, 5]);
        ctx.beginPath();
        ctx.moveTo(x, 8);
        ctx.lineTo(x, h - 8);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        if (!p.dead) {
          p.x += p.v * dt;
          const centre = h / 2;
          p.y += (centre - p.y) * dt * (0.25 + (p.x / w) * 1.4);
          if (p.fail < gates && p.x >= gateX(p.fail - 1) + 6) p.dead = true;
        } else {
          p.vy += 70 * dt;
          p.y += p.vy * dt;
          p.x += p.v * 0.2 * dt;
          p.a -= dt * 0.8;
        }
        const survived = p.fail >= gates && p.x > gateX(gates - 1);
        ctx.fillStyle = p.dead
          ? `rgba(255,138,114,${Math.max(p.a, 0) * 0.9})`
          : survived
            ? "rgba(212,240,106,1)"
            : "rgba(236,235,228,0.7)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, survived ? 2.6 : p.dead ? 2.2 : 1.8, 0, Math.PI * 2);
        ctx.fill();
        if (p.x > w + 10 || p.a <= 0 || p.y > h + 10) ps.splice(i, 1);
      }
    };
    const loop = (now: number) => {
      step(now);
      raf = requestAnimationFrame(loop);
    };

    // Pre-fill the stream so it never starts empty (and, for reduced motion, draw one static frame).
    const t0 = last;
    for (let t = 1; t <= 520; t++) step(t0 + 16 * t);
    last = performance.now();
    if (!reduced) raf = requestAnimationFrame(loop);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) step(last); // redraw the static frame after the canvas is cleared
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [inView]);

  return (
    <figure className="flow" ref={wrapRef}>
      <div className="flow__stage">
        <canvas ref={canvasRef} className="flow__canvas" aria-hidden="true" />
        <ol className="flow__gates">
          {autosect.pipeline.map((g, i) => (
            <li key={g.name}>
              <span className="flow__n">0{i + 1}</span>
              <span className="flow__name">{g.name}</span>
              <span className="flow__detail">{g.detail}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption>
        <span className="legend legend--in">Finding</span>
        <span className="legend legend--out">Rejected as false positive</span>
        <span className="legend legend--ok">Verified, explained insight</span>
        <span className="flow__note">Simplified illustration of the verification pipeline — not to scale.</span>
      </figcaption>
    </figure>
  );
}

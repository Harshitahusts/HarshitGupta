import { useRef, useState, type KeyboardEvent } from "react";
import { thinkingExamples, thinkingGates } from "@/content";

export default function Thinking() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const ex = thinkingExamples[active];

  const onKey = (e: KeyboardEvent) => {
    const n = thinkingExamples.length;
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % n;
    else if (e.key === "ArrowLeft") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className="thinking" id="thinking" aria-labelledby="thinking-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="kicker">How I think</p>
          <h2 id="thinking-title" className="section-title">
            A problem goes in. <em>Features come last.</em>
          </h2>
          <p className="section-lede">
            Five questions every problem passes through before it earns a roadmap slot. Pick a product to see the real
            answers.
          </p>
        </header>

        <div className="thinking__tabs" role="tablist" aria-label="Choose a product" onKeyDown={onKey} data-reveal>
          {thinkingExamples.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`think-tab-${t.id}`}
              aria-selected={active === i}
              aria-controls="think-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div
          className="gates"
          role="tabpanel"
          id="think-panel"
          aria-labelledby={`think-tab-${ex.id}`}
          key={ex.id}
          data-reveal
        >
          <span className="gates__line" aria-hidden />
          <ol>
            {thinkingGates.map((g, i) => (
              <li key={g} style={{ ["--i" as string]: i }}>
                <span className="gates__q">{g}</span>
                <p>{ex.answers[i]}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

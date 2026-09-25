import { useEffect, useRef, useState } from "react";
import type { JourneyScene } from "@/three/journeyScene";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Progressive enhancement: the page is complete without this component.
 * three.js is fetched only after first paint, and only when WebGL exists.
 */
export default function JourneyCanvas({
  subscribe,
  active,
  reducedMotion,
}: {
  subscribe: (fn: (stage: number) => void) => () => void;
  active: boolean;
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<JourneyScene | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    if (!hasWebGL()) {
      setStatus("fallback");
      return;
    }
    let cancelled = false;
    let onResize: (() => void) | undefined;
    let onPointer: ((e: PointerEvent) => void) | undefined;
    const mobile = window.matchMedia("(max-width: 899px), (pointer: coarse)").matches;

    const load = () =>
      import("@/three/journeyScene")
        .then(({ createJourneyScene }) => {
          if (cancelled || !canvasRef.current) return;
          const scene = createJourneyScene(canvasRef.current, { mobile, reducedMotion });
          sceneRef.current = scene;
          onResize = () => scene.resize();
          onPointer = (e: PointerEvent) =>
            scene.setPointer(e.clientX / window.innerWidth - 0.5, -(e.clientY / window.innerHeight - 0.5));
          window.addEventListener("resize", onResize);
          window.addEventListener("pointermove", onPointer, { passive: true });
          setStatus("ready");
        })
        .catch(() => setStatus("fallback"));

    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    if (idle) idle(load, { timeout: 1200 });
    else setTimeout(load, 200);

    return () => {
      cancelled = true;
      if (onResize) window.removeEventListener("resize", onResize);
      if (onPointer) window.removeEventListener("pointermove", onPointer);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (status !== "ready") return;
    // Reduced motion: discrete stages (cuts), never a continuous scroll-linked morph.
    return subscribe((s) => sceneRef.current?.setStage(reducedMotion ? Math.round(s) : s));
  }, [subscribe, status, reducedMotion]);

  // Only render frames while the journey is on screen and the tab is visible.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const sync = () => (active && !document.hidden ? scene.start() : scene.stop());
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [active, status]);

  return (
    <div className={`scene scene--${status}`} aria-hidden="true">
      <canvas ref={canvasRef} className="scene__canvas" />
      <div className="scene__fallback">
        <span className="scene__fallback-core" />
      </div>
      <div className="scene__vignette" />
    </div>
  );
}

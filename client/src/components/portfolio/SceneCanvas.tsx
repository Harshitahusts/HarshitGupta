import { useEffect, useRef, useState } from "react";
import type { CoreScene } from "@/three/coreScene";
import { usePrefersReducedMotion } from "./hooks";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Fixed, full-viewport background scene. Progressive enhancement: the page is complete without it.
 * three.js is fetched after first paint and only when WebGL exists.
 */
export default function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading"
  );

  useEffect(() => {
    if (!hasWebGL()) {
      setStatus("fallback");
      return;
    }
    let cancelled = false;
    let scene: CoreScene | null = null;
    const mobile = window.matchMedia(
      "(max-width: 899px), (pointer: coarse)"
    ).matches;

    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? window.scrollY / max : 0;
    };
    // Full strength behind the hero, dimmed behind reading content.
    const dim = () => {
      const t = Math.min(window.scrollY / window.innerHeight, 1);
      wrapRef.current?.style.setProperty(
        "--scene-dim",
        String(1 - t * (mobile ? 0.6 : 0.45))
      );
    };
    const onScroll = () => {
      dim();
      scene?.setProgress(progress());
    };
    dim();
    const onResize = () => {
      scene?.resize();
      onScroll();
    };
    const onPointer = (e: PointerEvent) =>
      scene?.setPointer(
        e.clientX / window.innerWidth - 0.5,
        -(e.clientY / window.innerHeight - 0.5)
      );
    const onVisibility = () =>
      document.hidden ? scene?.stop() : scene?.start();

    const load = () =>
      import("@/three/coreScene")
        .then(({ createCoreScene }) => {
          if (cancelled || !canvasRef.current) return;
          scene = createCoreScene(canvasRef.current, { mobile, reducedMotion });
          scene.setProgress(progress());
          scene.start();
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onResize);
          window.addEventListener("pointermove", onPointer, { passive: true });
          document.addEventListener("visibilitychange", onVisibility);
          setStatus("ready");
        })
        .catch(() => setStatus("fallback"));

    const idle = (
      window as Window & {
        requestIdleCallback?: (
          cb: () => void,
          o?: { timeout: number }
        ) => number;
      }
    ).requestIdleCallback;
    if (idle) idle(load, { timeout: 900 });
    else setTimeout(load, 150);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      scene?.dispose();
    };
  }, [reducedMotion]);

  return (
    <div ref={wrapRef} className={`scene scene--${status}`} aria-hidden="true">
      <canvas ref={canvasRef} className="scene__canvas" />
      <div className="scene__fallback" />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

type VantaEffect = { destroy: () => void };

type VantaTopologyFactory = (options: Record<string, unknown>) => VantaEffect;

export default function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let effect: VantaEffect | null = null;
    let cancelled = false;

    const init = async () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      const [p5Module, { default: TOPOLOGY }] = await Promise.all([
        import("p5"),
        import("vanta/dist/vanta.topology.min"),
      ]);

      if (cancelled || !containerRef.current) return;

      effect = (TOPOLOGY as VantaTopologyFactory)({
        el: containerRef.current,
        p5: p5Module.default,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0xc8ef5a,
        backgroundColor: 0x1a211c,
      });
    };

    init();

    return () => {
      cancelled = true;
      effect?.destroy();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div ref={containerRef} className="ambient-vanta absolute inset-0" />
      <div className="ambient-wash absolute inset-0" />
      <div className="ambient-vignette absolute inset-0" />
    </div>
  );
}

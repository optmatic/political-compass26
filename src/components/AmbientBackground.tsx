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
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

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
        color: 0x489650,
        backgroundColor: 0x0c1520,
      });
    };

    const scheduleInit = () => {
      timeoutId = setTimeout(() => {
        if ("requestIdleCallback" in window) {
          idleId = window.requestIdleCallback(() => {
            init();
          }, { timeout: 2200 });
        } else {
          init();
        }
      }, 900);
    };

    scheduleInit();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
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

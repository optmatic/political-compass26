"use client";

import BrandLogo from "@/components/BrandLogo";
import type { AppPhase } from "@/lib/types";

interface NavHeaderProps {
  onHome: () => void;
  phase: AppPhase;
}

const PHASES: { id: AppPhase; label: string }[] = [
  { id: "welcome", label: "Intro" },
  { id: "quiz", label: "Quiz" },
  { id: "results", label: "Results" },
];

export default function NavHeader({ onHome, phase }: NavHeaderProps) {
  const phaseIndex = PHASES.findIndex((p) => p.id === phase);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/70 bg-void/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <button
          type="button"
          onClick={onHome}
          className="mc-link mc-focus-ring flex items-center gap-3 rounded-md px-1 py-0.5 text-left"
        >
          <BrandLogo />
          <span>
            <span className="mc-brand-title block">OptiPol</span>
            <span className="mc-brand-tagline block">Fuck the binary</span>
          </span>
        </button>

        <nav className="hidden items-center gap-4 sm:flex" aria-label="Progress">
          {PHASES.map((p, i) => {
            const isActive = i === phaseIndex;
            const isDone = i < phaseIndex;

            return (
              <div key={p.id} className="flex items-center gap-4">
                <div className="mc-phase-step">
                  <span
                    className={`mc-phase-dot ${isDone ? "done" : isActive ? "active" : ""}`}
                    aria-hidden
                  />
                  <span
                    className={`mc-phase-label ${isDone ? "done" : isActive ? "active" : ""}`}
                  >
                    {p.label}
                  </span>
                </div>
                {i < PHASES.length - 1 && (
                  <span className="h-px w-5 bg-border" aria-hidden />
                )}
              </div>
            );
          })}
        </nav>

        {phase !== "welcome" ? (
          <button
            type="button"
            onClick={onHome}
            className="mc-btn-ghost mc-focus-ring px-4 py-2"
          >
            Home
          </button>
        ) : (
          <div className="w-[4.5rem]" aria-hidden />
        )}
      </div>
    </header>
  );
}

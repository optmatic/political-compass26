"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Axis, CompassResult } from "@/lib/types";
import { getBasicBitchIdeology } from "@/lib/basicBitchIdeology";
import { getAxisMeta } from "@/lib/axisMeta";
import RadarChart from "./RadarChart";
import AxisSpectrum from "./AxisSpectrum";
import Panel from "./Panel";

interface ResultsViewProps {
  result: CompassResult;
  axes: Axis[];
  onRetake: () => void;
  onHome: () => void;
}

function getHeadline(result: CompassResult, axes: Axis[]): string {
  if (result.dominantTraits.length > 0) {
    return result.dominantTraits.slice(0, 2).join(" · ");
  }
  const avg =
    result.axisScores.reduce((s, a) => s + a.normalized, 0) / result.axisScores.length;
  if (avg > 55) return "Leaning progressive across most axes";
  if (avg < 45) return "Leaning conservative across most axes";
  return "Balanced across the spectrum";
}

export default function ResultsView({ result, axes, onRetake, onHome }: ResultsViewProps) {
  const [showBasicBitch, setShowBasicBitch] = useState(false);
  const headline = getHeadline(result, axes);
  const basicBitch = getBasicBitchIdeology(result.axisScores);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto w-full max-w-4xl"
    >
      {/* Hero summary */}
      <Panel glow className="mb-8 p-6 sm:p-8">
        <div className="text-center">
          <p className="mc-label mc-label-accent mb-3">Assessment complete</p>
          <h2 className="mc-section-title sm:text-4xl">Your Position</h2>
          <p className="mt-4 font-display text-lg font-medium text-green-light">{headline}</p>
          {result.dominantTraits.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {result.dominantTraits.map((trait) => (
                <span key={trait} className="mc-badge">
                  {trait}
                </span>
              ))}
            </div>
          )}
        </div>
      </Panel>

      {/* Radar */}
      <Panel glow className="mb-8 p-6 sm:p-8">
        <p className="mc-label mb-5">Radar visualisation</p>
        <div className="mx-auto aspect-square w-full max-w-md">
          <RadarChart axes={axes} scores={result.axisScores} />
        </div>
      </Panel>

      {/* Profile */}
      <Panel className="mb-10 p-6 sm:p-8">
        <p className="mc-label mc-label-accent mb-5">Written profile</p>
        <p className="border-l-[3px] border-sage/60 py-1 pl-5 mc-body text-ink-subtle">
          {result.overallProfile}
        </p>
      </Panel>

      {/* Axis breakdown */}
      <section className="mb-10">
        <header className="mb-5">
          <p className="mc-label">Axis breakdown</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          {result.axisScores.map((score, i) => {
            const axis = axes.find((a) => a.id === score.axisId)!;
            const meta = getAxisMeta(axis.id);
            return (
              <motion.div
                key={score.axisId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Panel className="mc-panel-interactive h-full p-5 sm:p-6">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {meta && (
                        <span
                          className="mc-axis-icon"
                          style={{ color: axis.color, borderColor: `${axis.color}55` }}
                        >
                          {meta.icon}
                        </span>
                      )}
                      <div>
                        <h4 className="font-display text-sm font-semibold text-ink">
                          {axis.name}
                        </h4>
                        {meta && (
                          <p className="mt-0.5 font-sans text-xs text-ink-muted">
                            {meta.tagline}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className="font-display text-2xl font-bold tabular-nums"
                      style={{ color: axis.color }}
                    >
                      {score.normalized}
                    </span>
                  </div>

                  <AxisSpectrum
                    leftLabel={axis.left_label}
                    rightLabel={axis.right_label}
                    score={score.normalized}
                    accent={axis.color}
                  />

                  <p className="mt-4 mc-body-muted text-xs">{score.summary}</p>
                </Panel>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Panel className="mb-10 p-6 sm:p-8">
        {!showBasicBitch ? (
          <div className="text-center">
            <p className="mc-label mb-3">Optional · not serious</p>
            <button
              type="button"
              onClick={() => setShowBasicBitch(true)}
              className="mc-btn-ghost mc-focus-ring px-6 py-2.5 text-sm"
            >
              Show my basic bitch political ideology
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center"
          >
            <p className="mc-label mc-label-accent mb-3">Basic bitch diagnosis</p>
            <p className="font-display text-2xl font-semibold text-green-light sm:text-3xl">
              {basicBitch.label}
            </p>
            <p className="mt-2 font-display text-sm font-medium text-ink-subtle">
              {basicBitch.tagline}
            </p>
            <p className="mx-auto mt-4 max-w-lg mc-body-muted text-sm">{basicBitch.blurb}</p>
            <p className="mt-5 text-xs text-ink-muted">
              For entertainment only. Your actual profile above is the real read.
            </p>
            <button
              type="button"
              onClick={() => setShowBasicBitch(false)}
              className="mc-link mc-focus-ring mt-4 text-xs text-ink-muted underline-offset-2 hover:underline"
            >
              Hide this nonsense
            </button>
          </motion.div>
        )}
      </Panel>

      <div className="mc-action-bar">
        <button type="button" onClick={onRetake} className="mc-btn mc-focus-ring px-8 py-3">
          Retake
        </button>
        <button type="button" onClick={onHome} className="mc-btn-ghost mc-focus-ring px-8 py-3">
          Home
        </button>
      </div>
    </motion.div>
  );
}

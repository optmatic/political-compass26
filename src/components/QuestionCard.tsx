"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Question, Axis } from "@/lib/types";
import { getAxisMeta } from "@/lib/axisMeta";
import LikertScale from "./LikertScale";
import ProgressBar from "./ProgressBar";
import Panel from "./Panel";

interface QuestionCardProps {
  question: Question;
  axis: Axis;
  index: number;
  total: number;
  value: number | undefined;
  onAnswer: (value: number) => void;
  onBack: () => void;
  onHome: () => void;
  canGoBack: boolean;
}

export default function QuestionCard({
  question,
  axis,
  index,
  total,
  value,
  onAnswer,
  onBack,
  onHome,
  canGoBack,
}: QuestionCardProps) {
  const meta = getAxisMeta(axis.id);
  // When direction is -1, agreeing pushes toward left_label but Agree sits on the
  // right of the Likert scale — swap spectrum endpoints so labels align with choices.
  const spectrumLeftLabel =
    question.direction === -1 ? axis.right_label : axis.left_label;
  const spectrumRightLabel =
    question.direction === -1 ? axis.left_label : axis.right_label;

  return (
    <div className="w-full max-w-xl">
      <ProgressBar current={index + 1} total={total} />

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Panel glow className="quiz-panel mt-6 p-6 sm:p-8">
            {/* Header */}
            <div className="mb-7 flex items-center justify-between gap-4 border-b border-border pb-6">
              <div className="flex min-w-0 items-center gap-3.5">
                {meta && (
                  <span className="quiz-axis-icon">{meta.icon}</span>
                )}
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold text-neon">
                    {axis.name}
                  </p>
                  {meta && (
                    <p className="truncate font-sans text-xs text-ink-muted">
                      {meta.tagline}
                    </p>
                  )}
                </div>
              </div>
              <p className="quiz-question-num shrink-0">
                {String(index + 1).padStart(2, "0")}
                <span>/{String(total).padStart(2, "0")}</span>
              </p>
            </div>

            {/* Question */}
            <blockquote className="mb-8 border-l-[3px] border-sage/60 pl-5">
              <p className="font-sans text-lg font-normal leading-[1.7] text-ink sm:text-xl">
                {question.text}
              </p>
            </blockquote>

            {/* Axis spectrum hint */}
            <div className="quiz-spectrum-hint mb-7">
              <div className="quiz-spectrum-side">
                <p>{spectrumLeftLabel}</p>
              </div>
              <div className="quiz-spectrum-side text-right">
                <p>{spectrumRightLabel}</p>
              </div>
            </div>

            <LikertScale value={value} onChange={onAnswer} />
          </Panel>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              disabled={!canGoBack}
              className="mc-btn-ghost mc-focus-ring px-6 py-2.5"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={onHome}
              className="mc-btn-ghost mc-focus-ring px-6 py-2.5"
            >
              Start over
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

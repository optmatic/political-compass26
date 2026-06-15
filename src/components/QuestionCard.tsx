"use client";

import { useState } from "react";
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
  onNext: () => void;
  onHome: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLast: boolean;
}

export default function QuestionCard({
  question,
  axis,
  index,
  total,
  value,
  onAnswer,
  onBack,
  onNext,
  onHome,
  canGoBack,
  canGoNext,
  isLast,
}: QuestionCardProps) {
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const meta = getAxisMeta(axis.id);
  // When direction is -1, agreeing pushes toward left_label but Agree sits on the
  // right of the Likert scale, so swap spectrum endpoints to keep labels aligned with choices.
  const spectrumLeftLabel =
    question.direction === -1 ? axis.right_label : axis.left_label;
  const spectrumRightLabel =
    question.direction === -1 ? axis.left_label : axis.right_label;
  const explainer = getExplainer(axis, question);

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
              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsExplainerOpen(true)}
                  className="mc-info-btn mc-focus-ring"
                  aria-haspopup="dialog"
                >
                  <span aria-hidden="true">i</span>
                  <span>What does this mean?</span>
                </button>
                <p className="quiz-question-num">
                  {String(index + 1).padStart(2, "0")}
                  <span>/{String(total).padStart(2, "0")}</span>
                </p>
              </div>
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

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={!canGoBack}
              className="mc-btn-ghost mc-focus-ring justify-self-start px-6 py-2.5"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={onHome}
              className="mc-link mc-reset-link mc-focus-ring justify-self-center"
            >
              Reset quiz
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!canGoNext}
              className="mc-btn mc-focus-ring justify-self-end px-6 py-2.5"
            >
              {isLast ? "See results" : "Next"}
            </button>
          </div>

          {isExplainerOpen && (
            <div
              className="mc-explainer-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="question-explainer-title"
            >
              <button
                type="button"
                className="mc-explainer-backdrop"
                aria-label="Close issue explainer"
                onClick={() => setIsExplainerOpen(false)}
              />
              <Panel className="mc-explainer-dialog p-6 sm:p-7">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="mc-label mb-2">Issue explainer</p>
                    <h2
                      id="question-explainer-title"
                      className="font-display text-2xl font-semibold text-ink"
                    >
                      {explainer.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="mc-explainer-close mc-focus-ring"
                    aria-label="Close issue explainer"
                    onClick={() => setIsExplainerOpen(false)}
                  >
                    X
                  </button>
                </div>

                <blockquote className="mb-5 border-l-[3px] border-sage/60 pl-4">
                  <p className="font-sans text-base leading-7 text-ink">
                    {question.text}
                  </p>
                </blockquote>

                <div className="space-y-4 font-sans text-sm leading-7 text-ink-muted">
                  <p>{explainer.summary}</p>
                  <p>{explainer.why}</p>
                </div>

                <div className="mt-5 rounded-lg border border-border bg-void/45 p-4">
                  <p className="mc-label mb-2">How to read your answer</p>
                  <p className="font-sans text-sm leading-7 text-ink-muted">
                    {explainer.axis}
                  </p>
                </div>

                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    explainer.youtubeSearch
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mc-youtube-link mc-focus-ring mt-5"
                >
                  Find a YouTube explainer
                </a>
              </Panel>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function getExplainer(axis: Axis, question: Question) {
  const axisExplainers: Record<
    string,
    {
      title: string;
      summary: string;
      why: string;
      axis: string;
      youtubeSearch: string;
    }
  > = {
    economy: {
      title: "Economy",
      summary:
        "This question asks how much economic life should be shaped by public rules versus private choice. Some interventions protect workers, consumers and services; too much control can reduce flexibility, investment and competition.",
      why:
        "Your answer helps place you between economic control and economic freedom. It is measuring which risk feels more serious to you: unfair markets or overbearing government.",
      axis:
        `Answers leaning ${axis.left_label} move toward ${axis.left_description.toLowerCase()}. Answers leaning ${axis.right_label} move toward ${axis.right_description.toLowerCase()}.`,
      youtubeSearch: "economic regulation market freedom redistribution explained"
    },
    social_liberty: {
      title: "Social liberty",
      summary:
        "This question is about the boundary between personal freedom and social order. It asks when society should leave people alone, and when rules or norms should guide behaviour.",
      why:
        "Your answer shows whether you are more worried about coercion and moral policing, or about disorder and the loss of shared standards.",
      axis:
        `Answers leaning ${axis.left_label} favour ${axis.left_description.toLowerCase()}. Answers leaning ${axis.right_label} favour ${axis.right_description.toLowerCase()}.`,
      youtubeSearch: "civil liberties social order individual freedom explained"
    },
    globalism_nationalism: {
      title: "Globalism vs nationalism",
      summary:
        "This question weighs national sovereignty, borders and local control against international cooperation, openness and global exchange.",
      why:
        "Your answer helps reveal whether you instinctively trust national boundaries or cross-border cooperation more when values and interests collide.",
      axis:
        `Answers leaning ${axis.left_label} prioritise ${axis.left_description.toLowerCase()}. Answers leaning ${axis.right_label} prioritise ${axis.right_description.toLowerCase()}.`,
      youtubeSearch: "globalism nationalism sovereignty open borders explained"
    },
    institutional_trust: {
      title: "Institutional trust",
      summary:
        "This question asks how much confidence you place in experts, courts, media, public agencies and other institutions that claim authority.",
      why:
        "Your answer shows whether you are more concerned about elite capture and arrogance, or about weakening the systems that keep public life stable.",
      axis:
        `Answers leaning ${axis.left_label} reflect ${axis.left_description.toLowerCase()}. Answers leaning ${axis.right_label} reflect ${axis.right_description.toLowerCase()}.`,
      youtubeSearch: "institutional trust populism experts media courts explained"
    },
    science_health: {
      title: "Science and public health",
      summary:
        "This question weighs evidence-based policy and public health protection against individual choice and scepticism of medical or scientific authority.",
      why:
        "Your answer helps show whether you are more comfortable with expert-led collective rules or personal discretion when health risks affect others.",
      axis:
        `Answers leaning ${axis.left_label} move toward ${axis.left_description.toLowerCase()}. Answers leaning ${axis.right_label} move toward ${axis.right_description.toLowerCase()}.`,
      youtubeSearch: "public health mandates medical science individual choice explained"
    },
    technology_ai: {
      title: "Technology and AI",
      summary:
        "This question tests whether fast innovation should be encouraged, slowed, or tightly governed when technology affects work, privacy and power.",
      why:
        "Your answer shows whether you fear falling behind more than you fear unsafe or unfair systems, or the other way around.",
      axis:
        `Answers leaning ${axis.left_label} favour ${axis.left_description.toLowerCase()}. Answers leaning ${axis.right_label} favour ${axis.right_description.toLowerCase()}.`,
      youtubeSearch: "AI regulation accelerationism technology policy explained"
    },
    climate_energy: {
      title: "Climate and energy",
      summary:
        "This question balances emissions, energy costs, reliability, jobs and the pace of industrial change.",
      why:
        "Your answer helps show whether you prioritise faster decarbonisation, cost and reliability, or a careful blend of both.",
      axis:
        `Answers leaning ${axis.left_label} reflect ${axis.left_description.toLowerCase()}. Answers leaning ${axis.right_label} reflect ${axis.right_description.toLowerCase()}.`,
      youtubeSearch: "climate policy energy transition renewables costs explained"
    },
    information_truth: {
      title: "Information and truth",
      summary:
        "This question is about speech, misinformation and who gets to decide what counts as trustworthy in public debate.",
      why:
        "Your answer helps place you between open discourse and moderated information spaces. It is really asking which danger feels bigger: censorship and gatekeeping, or false claims spreading unchecked.",
      axis:
        `Answers leaning ${axis.left_label} favour ${axis.left_description.toLowerCase()}. Answers leaning ${axis.right_label} favour ${axis.right_description.toLowerCase()}.`,
      youtubeSearch: "misinformation fact checking free speech content moderation explained"
    }
  };

  return (
    axisExplainers[axis.id] ?? {
      title: axis.name,
      summary:
        "This prompt is designed to reveal an instinct, not to force a perfect policy position.",
      why:
        "Think about what the statement prioritises, what trade-off it asks you to accept, and which side feels more persuasive.",
      axis:
        `This question sits between ${axis.left_label} and ${axis.right_label}. Stronger answers move your score further along that axis.`,
      youtubeSearch: `${axis.name} public policy explained ${question.text}`
    }
  );
}

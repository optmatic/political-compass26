"use client";

import { motion } from "framer-motion";

const LIKERT_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
] as const;

interface LikertScaleProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

export default function LikertScale({ value, onChange }: LikertScaleProps) {
  return (
    <div className="likert-scale" role="radiogroup" aria-label="Agreement scale">
      <p className="mc-label mb-3">Select one</p>

      <div className="likert-options">
        {LIKERT_OPTIONS.map((option, index) => {
          const isSelected = value === option.value;
          const isLast = index === LIKERT_OPTIONS.length - 1;

          return (
            <motion.button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={option.label}
              onClick={() => onChange(option.value)}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className={`likert-option mc-focus-ring ${isSelected ? "likert-option-selected" : ""} ${isLast ? "likert-option-last" : ""}`}
            >
              <span className={`likert-radio ${isSelected ? "likert-radio-selected" : ""}`}>
                {isSelected && (
                  <motion.span
                    className="likert-radio-dot"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  />
                )}
              </span>
              <span className="likert-label" aria-hidden="true">
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

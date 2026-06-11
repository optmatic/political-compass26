"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

const barTransition = { type: "spring" as const, stiffness: 100, damping: 22 };

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="mc-label mb-1">Progress</p>
          <p className="font-display text-2xl font-semibold tabular-nums text-neon">
            <motion.span
              key={current}
              initial={{ opacity: 0.4, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {current}
            </motion.span>
            <span className="text-lg font-normal text-ink-muted"> / {total}</span>
          </p>
        </div>
        <motion.p
          key={Math.round(pct)}
          className="font-display text-2xl font-semibold tabular-nums text-ink-faint"
          initial={{ opacity: 0.4, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {Math.round(pct)}%
        </motion.p>
      </div>

      <div className="mc-progress-track">
        <motion.div
          className="mc-progress-fill"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={barTransition}
        />
      </div>
    </div>
  );
}

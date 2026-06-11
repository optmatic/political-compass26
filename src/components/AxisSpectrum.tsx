"use client";

interface AxisSpectrumProps {
  leftLabel: string;
  rightLabel: string;
  score: number;
  accent?: string;
}

export default function AxisSpectrum({
  leftLabel,
  rightLabel,
  score,
  accent = "#72c94e",
}: AxisSpectrumProps) {
  return (
    <div className="axis-spectrum">
      <div className="axis-spectrum-track">
        <div
          className="axis-spectrum-fill"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, transparent, ${accent})`,
          }}
        />
        <div
          className="axis-spectrum-marker"
          style={{ left: `${score}%`, backgroundColor: accent }}
        />
      </div>
      <div className="axis-spectrum-labels">
        <span className="max-w-[44%] text-left">{leftLabel}</span>
        <span className="max-w-[44%] text-right">{rightLabel}</span>
      </div>
    </div>
  );
}

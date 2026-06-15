"use client";

function polarToCartesian(angle: number, radius: number, cx: number, cy: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

const LABELS = ["Eco", "Lib", "Glob", "Inst", "Sci", "Tech", "Clim", "Info"];

const SAGE = "#62c454";
const SAGE_FAINT = "rgba(98, 196, 84, 0.14)";
const SAGE_LINE = "rgba(98, 196, 84, 0.24)";
const LABEL_FILL = "#7d9186";

export default function CompassPreview() {
  const cx = 120;
  const cy = 120;
  const r = 80;
  const points = LABELS.map((_, i) => {
    const angle = (360 / LABELS.length) * i;
    const outer = polarToCartesian(angle, r, cx, cy);
    const inner = polarToCartesian(angle, r * 0.55, cx, cy);
    return { outer, inner, angle, label: LABELS[i] };
  });

  const polygon = points.map((p) => `${p.inner.x},${p.inner.y}`).join(" ");

  return (
    <div className="compass-preview relative mx-auto aspect-square w-full max-w-[280px]">
      <div className="compass-preview-ring absolute inset-0 rounded-full" />
      <svg viewBox="0 0 240 240" className="relative h-full w-full" aria-hidden>
        {[0.35, 0.55, 0.75, 1].map((scale) => (
          <circle
            key={scale}
            cx={cx}
            cy={cy}
            r={r * scale}
            fill="none"
            stroke={SAGE_LINE}
            strokeWidth="1"
          />
        ))}

        {points.map((p, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.outer.x}
            y2={p.outer.y}
            stroke={SAGE_LINE}
            strokeWidth="1"
          />
        ))}

        <polygon
          points={polygon}
          fill={SAGE_FAINT}
          stroke={SAGE}
          strokeWidth="1.5"
        />

        <circle cx={cx} cy={cy} r="3" fill={SAGE} opacity="0.7" />

        {points.map((p, i) => {
          const labelPt = polarToCartesian(p.angle, r + 18, cx, cy);
          return (
            <text
              key={i}
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={LABEL_FILL}
              fontSize="9"
              fontFamily="var(--font-exo2)"
              fontWeight="500"
            >
              {p.label}
            </text>
          );
        })}
      </svg>
      <p className="mt-3 text-center mc-label">8-axis radar output</p>
    </div>
  );
}

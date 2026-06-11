"use client";

import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { Axis, AxisScore } from "@/lib/types";

const CHART_GREEN = "#72c94e";

interface RadarChartProps {
  axes: Axis[];
  scores: AxisScore[];
}

export default function RadarChart({ axes, scores }: RadarChartProps) {
  const scoreMap = new Map(scores.map((s) => [s.axisId, s.normalized]));

  const data = axes.map((axis) => ({
    axis: axis.name.length > 12 ? axis.name.split(" ")[0] : axis.name,
    fullName: axis.name,
    score: scoreMap.get(axis.id) ?? 50,
    leftLabel: axis.left_label,
    rightLabel: axis.right_label,
    color: axis.color,
  }));

  return (
    <div className="h-full w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="78%">
          <PolarGrid stroke="#3a4f42" radialLines={true} />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "#8fa898", fontSize: 12, fontFamily: "var(--font-exo2)", fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#5f7568", fontSize: 10 }}
            tickCount={6}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke={CHART_GREEN}
            fill={CHART_GREEN}
            fillOpacity={0.22}
            strokeWidth={2}
            dot={{ fill: CHART_GREEN, strokeWidth: 0, r: 4 }}
          />
          <Tooltip
            content={({ payload }) => {
              if (!payload?.[0]) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded-lg border border-border bg-surface-raised px-4 py-3 font-sans text-sm shadow-xl">
                  <p className="font-display text-sm font-semibold text-ink">{d.fullName}</p>
                  <p className="font-display text-2xl font-bold" style={{ color: d.color }}>
                    {d.score}
                  </p>
                  <p className="mt-2 text-xs text-ink-muted">
                    0 = {d.leftLabel}
                  </p>
                  <p className="text-xs text-ink-muted">
                    100 = {d.rightLabel}
                  </p>
                </div>
              );
            }}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}

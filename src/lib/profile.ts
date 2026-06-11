import type { Axis, CompassData, CompassResult, AxisScore } from "./types";

function getPositionLabel(score: number, leftLabel: string, rightLabel: string): string {
  if (score < 30) return leftLabel;
  if (score < 45) return `leaning ${leftLabel}`;
  if (score <= 55) return "centrist";
  if (score <= 70) return `leaning ${rightLabel}`;
  return rightLabel;
}

export function generateProfile(data: CompassData, axisScores: AxisScore[]): CompassResult {
  const axisMap = new Map(data.axes.map((a) => [a.id, a]));
  const scoreMap = new Map(axisScores.map((s) => [s.axisId, s]));

  const dominantTraits: string[] = [];

  for (const score of axisScores) {
    const axis = axisMap.get(score.axisId)!;
    if (score.normalized < 25 || score.normalized > 75) {
      const label =
        score.normalized < 25 ? axis.left_label : axis.right_label;
      dominantTraits.push(label);
    }
  }

  const sentences: string[] = [];

  const economy = scoreMap.get("economy");
  const social = scoreMap.get("social_liberty");
  const global = scoreMap.get("globalism_nationalism");
  const trust = scoreMap.get("institutional_trust");
  const science = scoreMap.get("science_health");
  const tech = scoreMap.get("technology_ai");
  const climate = scoreMap.get("climate_energy");
  const info = scoreMap.get("information_truth");

  if (economy && social) {
    const econAxis = axisMap.get("economy")!;
    const socAxis = axisMap.get("social_liberty")!;
    sentences.push(
      `On the economy, you're ${getPositionLabel(economy.normalized, econAxis.left_label, econAxis.right_label).toLowerCase()}, while on social issues you sit ${getPositionLabel(social.normalized, socAxis.left_label, socAxis.right_label).toLowerCase()}.`
    );
  }

  if (global && trust) {
    const globAxis = axisMap.get("globalism_nationalism")!;
    const trustAxis = axisMap.get("institutional_trust")!;
    sentences.push(
      `Your worldview is ${getPositionLabel(global.normalized, globAxis.left_label, globAxis.right_label).toLowerCase()} and ${getPositionLabel(trust.normalized, trustAxis.left_label, trustAxis.right_label).toLowerCase()} when it comes to institutions.`
    );
  }

  if (science && tech) {
    const sciAxis = axisMap.get("science_health")!;
    const techAxis = axisMap.get("technology_ai")!;
    sentences.push(
      `On science and health you're ${getPositionLabel(science.normalized, sciAxis.left_label, sciAxis.right_label).toLowerCase()}, and on technology you're ${getPositionLabel(tech.normalized, techAxis.left_label, techAxis.right_label).toLowerCase()}.`
    );
  }

  if (climate && info) {
    const climAxis = axisMap.get("climate_energy")!;
    const infoAxis = axisMap.get("information_truth")!;
    sentences.push(
      `Climate-wise you favour ${getPositionLabel(climate.normalized, climAxis.left_label, climAxis.right_label).toLowerCase()} approaches, and on information you lean ${getPositionLabel(info.normalized, infoAxis.left_label, infoAxis.right_label).toLowerCase()}.`
    );
  }

  if (dominantTraits.length > 0) {
    sentences.push(
      `Your strongest convictions: ${dominantTraits.slice(0, 4).join(", ")}.`
    );
  } else {
    sentences.push(
      "You're a genuine moderate. No single axis dominates your profile."
    );
  }

  return {
    axisScores,
    overallProfile: sentences.join(" "),
    dominantTraits,
  };
}

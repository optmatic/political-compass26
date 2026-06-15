import type { AxisScore } from "./types";

export interface BasicBitchIdeology {
  label: string;
  tagline: string;
  blurb: string;
}

function getAxisScore(axisScores: AxisScore[], axisId: string): number {
  return axisScores.find((s) => s.axisId === axisId)?.normalized ?? 50;
}

function deviationFromCenter(scores: number[]): number {
  return scores.reduce((sum, s) => sum + Math.abs(s - 50), 0) / scores.length;
}

function centerMatch(scores: number[]): number {
  const averageDeviation = deviationFromCenter(scores);
  const widestDeviation = Math.max(...scores.map((s) => Math.abs(s - 50)));

  if (averageDeviation <= 4 && widestDeviation <= 9) {
    return 76 - averageDeviation * 3;
  }

  if (averageDeviation <= 7 && widestDeviation <= 14) {
    return 56 - averageDeviation * 4;
  }

  return Math.max(0, 24 - averageDeviation * 2 - Math.max(0, widestDeviation - 18));
}

interface IdeologyCandidate extends BasicBitchIdeology {
  match: number;
}

/** Map compass scores to the closest jokey "basic bitch" political label. */
export function getBasicBitchIdeology(axisScores: AxisScore[]): BasicBitchIdeology {
  const economy = getAxisScore(axisScores, "economy");
  const social = getAxisScore(axisScores, "social_liberty");
  const globalism = getAxisScore(axisScores, "globalism_nationalism");
  const trust = getAxisScore(axisScores, "institutional_trust");
  const science = getAxisScore(axisScores, "science_health");
  const climate = getAxisScore(axisScores, "climate_energy");
  const info = getAxisScore(axisScores, "information_truth");

  const leftEconomy = 100 - economy;
  const nationalist = 100 - globalism;
  const authoritarian = 100 - social;
  const populist = 100 - trust;
  const climateActivist = climate;
  const proScience = science;
  const proModeration = info;
  const scores = [
    economy,
    social,
    globalism,
    trust,
    science,
    climate,
    info,
  ];
  const centrist = centerMatch(scores);

  const candidates: IdeologyCandidate[] = [
    {
      label: "Far Right Nazi",
      tagline: "Very online, very concerned about borders",
      blurb:
        "Nationalist, authoritarian, populist: the unholy trinity. You'd probably get banned from a family WhatsApp group within a week.",
      match:
        nationalist * 0.32 +
        authoritarian * 0.28 +
        populist * 0.22 +
        (100 - proScience) * 0.1 +
        leftEconomy * 0.08,
    },
    {
      label: "Right-Wing Culture Warrior",
      tagline: "Tradition, markets, and a podcast about both",
      blurb:
        "Free markets, closed borders, strong vibes about 'the way things used to be.' Owns at least one flag-themed merchandise item.",
      match:
        economy * 0.28 +
        nationalist * 0.28 +
        authoritarian * 0.18 +
        (100 - climateActivist) * 0.16 +
        populist * 0.1,
    },
    {
      label: "Woke Leftist",
      tagline: "Posting through it, sustainably",
      blurb:
        "Globalist, pro-science, decarbonisation maxxer. Your bio probably mentions pronouns and a mutual aid link.",
      match:
        globalism * 0.22 +
        climateActivist * 0.28 +
        proScience * 0.22 +
        proModeration * 0.18 +
        leftEconomy * 0.1,
    },
    {
      label: "Champagne Socialist",
      tagline: "Eat the rich (but make it aesthetic)",
      blurb:
        "Strong redistribution energy. You've explained surplus value to someone at a party who did not ask.",
      match:
        leftEconomy * 0.45 +
        climateActivist * 0.15 +
        globalism * 0.15 +
        proScience * 0.15 +
        (100 - proModeration) * 0.1,
    },
    {
      label: "Soft Lefty",
      tagline: "Progressive, but still pays taxes willingly",
      blurb:
        "Leans progressive on most things without going full manifesto. Probably has strong opinions about healthcare.",
      match:
        leftEconomy * 0.22 +
        social * 0.18 +
        globalism * 0.2 +
        climateActivist * 0.2 +
        proScience * 0.2,
    },
    {
      label: "Free-Market Trad",
      tagline: "Markets good, change suspicious",
      blurb:
        "Economically free-market, culturally cautious. Thinks most problems have a private-sector solution somewhere.",
      match:
        economy * 0.3 +
        nationalist * 0.22 +
        authoritarian * 0.18 +
        (100 - climateActivist) * 0.15 +
        (100 - proModeration) * 0.15,
    },
    {
      label: "Basic Bitch Moderate",
      tagline: "Both sides have a point (allegedly)",
      blurb:
        "Genuinely balanced, or painfully indecisive, depending who you ask. The political equivalent of ordering 'surprise me' at a restaurant.",
      match: centrist,
    },
  ];

  const best = candidates.reduce((a, b) => (b.match > a.match ? b : a));

  return {
    label: best.label,
    tagline: best.tagline,
    blurb: best.blurb,
  };
}

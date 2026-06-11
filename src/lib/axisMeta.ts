export const AXIS_META = [
  {
    id: "economy",
    short: "Economy",
    tagline: "Markets vs redistribution",
    icon: "◈",
  },
  {
    id: "social_liberty",
    short: "Liberty",
    tagline: "Order vs personal freedom",
    icon: "◇",
  },
  {
    id: "globalism_nationalism",
    short: "Globalism",
    tagline: "Borders vs cooperation",
    icon: "◎",
  },
  {
    id: "institutional_trust",
    short: "Institutions",
    tagline: "Populism vs expertise",
    icon: "◆",
  },
  {
    id: "science_health",
    short: "Science",
    tagline: "Mandates vs choice",
    icon: "⬡",
  },
  {
    id: "technology_ai",
    short: "Tech & AI",
    tagline: "Regulation vs acceleration",
    icon: "▣",
  },
  {
    id: "climate_energy",
    short: "Climate",
    tagline: "Pragmatism vs decarbonisation",
    icon: "◐",
  },
  {
    id: "information_truth",
    short: "Information",
    tagline: "Speech vs moderation",
    icon: "◉",
  },
] as const;

export function getAxisMeta(axisId: string) {
  return AXIS_META.find((a) => a.id === axisId);
}

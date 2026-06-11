export interface Question {
  id: string;
  text: string;
  axis_id: string;
  direction: 1 | -1;
}

export interface Axis {
  id: string;
  name: string;
  left_label: string;
  right_label: string;
  left_description: string;
  right_description: string;
  questions: string[];
  color: string;
}

export interface CompassData {
  meta: {
    title: string;
    version: string;
    date: string;
    author: string;
  };
  axes: Axis[];
  questions: Question[];
}

export type Responses = Record<string, number>;

export interface AxisScore {
  axisId: string;
  raw: number;
  normalized: number;
  interpretation: string;
  summary: string;
}

export interface CompassResult {
  axisScores: AxisScore[];
  overallProfile: string;
  dominantTraits: string[];
}

export type AppPhase = "welcome" | "quiz" | "results";

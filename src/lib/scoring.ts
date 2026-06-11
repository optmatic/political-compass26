import type { Axis, CompassData, CompassResult, Responses, AxisScore, Question } from "./types";
import { generateProfile } from "./profile";

export const QUESTIONS_PER_AXIS = 5;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function scoreQuestion(response: number, direction: 1 | -1): number {
  return direction * (response - 3);
}

function normalizeScore(raw: number, questionCount: number): number {
  const min = -2 * questionCount;
  const max = 2 * questionCount;
  return ((raw - min) / (max - min)) * 100;
}

function getLeanLabel(score: number, leftLabel: string, rightLabel: string): string {
  if (score < 30) return `strongly ${leftLabel.toLowerCase()}`;
  if (score < 45) return `moderately ${leftLabel.toLowerCase()}`;
  if (score <= 55) return "balanced / mixed";
  if (score <= 70) return `moderately ${rightLabel.toLowerCase()}`;
  return `strongly ${rightLabel.toLowerCase()}`;
}

function interpretAxis(axis: Axis, normalized: number): { interpretation: string; summary: string } {
  const lean = getLeanLabel(normalized, axis.left_label, axis.right_label);
  const interpretation = `You lean ${lean} on ${axis.name}.`;

  let summary: string;
  if (normalized < 30) {
    summary = `Strong ${axis.left_label}: ${axis.left_description}.`;
  } else if (normalized < 45) {
    summary = `Moderate ${axis.left_label}: trending toward ${axis.left_description.toLowerCase()}.`;
  } else if (normalized <= 55) {
    summary = `Centrist on ${axis.name}: you see merit in both ${axis.left_label} and ${axis.right_label} perspectives.`;
  } else if (normalized <= 70) {
    summary = `Moderate ${axis.right_label}: trending toward ${axis.right_description.toLowerCase()}.`;
  } else {
    summary = `Strong ${axis.right_label}: ${axis.right_description}.`;
  }

  return { interpretation, summary };
}

/** Pick 5 random questions per axis (40 total), then shuffle order. */
export function getQuizQuestions(data: CompassData): Question[] {
  const questionMap = new Map(data.questions.map((q) => [q.id, q]));
  const selected: Question[] = [];

  for (const axis of data.axes) {
    const pool = axis.questions
      .map((id) => questionMap.get(id))
      .filter((q): q is Question => q !== undefined);
    selected.push(...shuffle(pool).slice(0, QUESTIONS_PER_AXIS));
  }

  return shuffle(selected);
}

export function computeScores(
  data: CompassData,
  responses: Responses,
  quizQuestions: Question[]
): CompassResult {
  const axisScores: AxisScore[] = data.axes.map((axis) => {
    const axisQs = quizQuestions.filter((q) => q.axis_id === axis.id);
    let raw = 0;
    let answered = 0;

    for (const q of axisQs) {
      const response = responses[q.id];
      if (response !== undefined) {
        raw += scoreQuestion(response, q.direction);
        answered++;
      }
    }

    const normalized = answered > 0 ? normalizeScore(raw, answered) : 50;
    const { interpretation, summary } = interpretAxis(axis, normalized);

    return {
      axisId: axis.id,
      raw,
      normalized: Math.round(normalized * 10) / 10,
      interpretation,
      summary,
    };
  });

  return generateProfile(data, axisScores);
}

import type { QuizQuestion } from './types';

export const r = String.raw;

export function q(
  id: string,
  section: string,
  prompt: string,
  answers: string[],
  extra: { context?: string; note?: string } = {},
): QuizQuestion {
  return { id, section, prompt, answers, ...extra };
}

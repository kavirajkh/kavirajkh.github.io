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

/** Multiple-choice question: the first listed option is the correct one and is shuffled on screen. */
export function mc(
  id: string,
  section: string,
  prompt: string,
  correct: string,
  wrong: string[],
  extra: { context?: string; note?: string } = {},
): QuizQuestion {
  return { id, section, prompt, answers: [correct], choices: [correct, ...wrong], ...extra };
}

/** Orders questions by an importance list; unlisted ones keep their authored order after it. */
export function rankQuestions(authored: QuizQuestion[], priority: string[]): QuizQuestion[] {
  const byId = new Map(authored.map((item) => [item.id, item]));
  const ranked = priority.map((id) => {
    const item = byId.get(id);
    if (!item) throw new Error(`Unknown id in priority list: ${id}`);
    return item;
  });
  const listed = new Set(priority);
  return [...ranked, ...authored.filter((item) => !listed.has(item.id))];
}

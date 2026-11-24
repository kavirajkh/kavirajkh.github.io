export type QuizQuestion = {
  id: string;
  section: string;
  /** What the learner has to write, in plain words. */
  prompt: string;
  /** Optional declarations the answer can rely on, shown as code. */
  context?: string;
  /** First entry is shown as the model answer; the rest are also accepted. */
  answers: string[];
  /** Multiple choice: all options including the correct one (answers[0]); shown shuffled. */
  choices?: string[];
  /**
   * Plain-language walkthrough of the answer, shown after answering. Paragraphs are separated
   * by newlines, lines starting with "- " become a bullet list, and `backticks` mark code.
   */
  explain?: string;
  /** A memory hook, in the same format as explain. */
  remember?: string;
  /** Optional gotcha shown after answering. */
  note?: string;
};

export type Quiz = {
  slug: string;
  title: string;
  description: string;
  /** Link back to the reference material the quiz is built from. */
  source: { label: string; href: string };
  questions: QuizQuestion[];
};

import type { Quiz } from './types';
import { syntaxQuiz } from './syntax';
import { bigoQuiz } from './bigo';

export const quizzes: Quiz[] = [syntaxQuiz, bigoQuiz];

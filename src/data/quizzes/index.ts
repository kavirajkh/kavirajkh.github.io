import type { Quiz } from './types';
import { syntaxQuiz } from './syntax';
import { bigoQuiz } from './bigo';
import { javafpQuiz } from './javafp';

export const quizzes: Quiz[] = [syntaxQuiz, bigoQuiz, javafpQuiz];

import type { Quiz } from './types';
import { syntaxQuiz } from './syntax';
import { bigoQuiz } from './bigo';
import { javafpQuiz } from './javafp';
import { patternsQuiz } from './patterns';

export const quizzes: Quiz[] = [patternsQuiz, syntaxQuiz, bigoQuiz, javafpQuiz];

import type { Quiz } from './types';
import { syntaxQuiz } from './syntax';
import { bigoQuiz } from './bigo';
import { javafpQuiz } from './javafp';
import { patternsQuiz } from './patterns';
import { criticalQuiz } from './critical';

export const quizzes: Quiz[] = [patternsQuiz, criticalQuiz, syntaxQuiz, bigoQuiz, javafpQuiz];

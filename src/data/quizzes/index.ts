import type { Quiz } from './types';
import { syntaxQuiz } from './syntax';
import { bigoQuiz } from './bigo';
import { javafpQuiz } from './javafp';
import { patternsQuiz } from './patterns';
import { criticalQuiz } from './critical';
import { conversionsQuiz } from './conversions';
import { springQuiz } from './spring';
import { kafkaQuiz } from './kafka';

export const quizzes: Quiz[] = [
  patternsQuiz,
  criticalQuiz,
  syntaxQuiz,
  conversionsQuiz,
  bigoQuiz,
  javafpQuiz,
  springQuiz,
  kafkaQuiz,
];

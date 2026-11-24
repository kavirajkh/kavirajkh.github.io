import type { Explanation } from './syntax-explanations-types';
import { arrayExplanations } from './syntax-explain-arrays';
import { stringExplanations } from './syntax-explain-strings';
import { mapExplanations, setExplanations, listExplanations } from './syntax-explain-collections';
import { dequeExplanations, pqExplanations } from './syntax-explain-queues';
import { numExplanations, cmpExplanations } from './syntax-explain-math';
import {
  sbExplanations,
  treeExplanations,
  convExplanations,
  nodeExplanations,
} from './syntax-explain-tools';

/** Walkthrough and memory hook for each syntax question, keyed by question id. */
export const syntaxExplanations: Record<string, Explanation> = {
  ...arrayExplanations,
  ...stringExplanations,
  ...mapExplanations,
  ...setExplanations,
  ...listExplanations,
  ...dequeExplanations,
  ...pqExplanations,
  ...numExplanations,
  ...cmpExplanations,
  ...sbExplanations,
  ...treeExplanations,
  ...convExplanations,
  ...nodeExplanations,
};

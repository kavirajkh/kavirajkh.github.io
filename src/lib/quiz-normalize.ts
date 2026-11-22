/**
 * Normalizes a Java line so equivalent spellings compare equal:
 * comments and the trailing semicolon are dropped, whitespace around punctuation
 * is ignored, and the first lambda's parameter names are renamed to placeholders.
 */
function renameWord(src: string, from: string, to: string): string {
  return src.replace(new RegExp(`\\b${from}\\b`, 'g'), to);
}

export function normalizeCode(input: string): string {
  let s = input.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  s = s
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[;\s]+$/, '');

  const pair = s.match(/\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*->/);
  if (pair) {
    s = renameWord(s, pair[1], '§1');
    s = renameWord(s, pair[2], '§2');
  } else {
    const single = s.match(/\(?\s*\b(\w+)\s*\)?\s*->/);
    if (single) s = renameWord(s, single[1], '§1');
  }

  return s.replace(/\s*([^\w\s$])\s*/g, '$1');
}

export function levenshtein(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

export type CheckResult = 'correct' | 'close' | 'wrong';

export function checkAnswer(user: string, accepted: string[]): CheckResult {
  const u = normalizeCode(user);
  if (!u) return 'wrong';
  const targets = accepted.map(normalizeCode);
  if (targets.includes(u)) return 'correct';
  const best = Math.min(...targets.map((t) => levenshtein(u, t) / Math.max(t.length, 1)));
  return best <= 0.2 ? 'close' : 'wrong';
}

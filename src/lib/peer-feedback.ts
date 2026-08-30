import Papa from 'papaparse';

export const PEER_FEEDBACK_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRA7sb8Oefi10nEMzq39UxO4nNDyxeQ0MPwBbMvIeVUfSh9FrwzjYIZwgSJwyoSYrWlouaoEI6Ecnuo/pub?gid=283203256&single=true&output=csv';

export interface SkillAverage {
  key: string;
  label: string;
  average: number | null;
  count: number;
}

export interface Tally {
  label: string;
  count: number;
}

export interface FeedbackAggregate {
  totalResponses: number;
  skillAverages: SkillAverage[];
  overallRatingAverage: number | null;
  overallRatingCount: number;
  interviewTypeCounts: Tally[];
  recommendationCounts: Tally[];
  confidenceCounts: Tally[];
  readinessCounts: Tally[];
  improvementAreaCounts: Tally[];
  highlights: string[];
  growthAreas: string[];
  additionalNotes: string[];
}

function normalizeHeader(header: string): string {
  return header.replace(/\s+/g, ' ').trim();
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wordPattern(phrase: string): RegExp {
  return new RegExp(`\\b${escapeRegExp(phrase)}\\b`, 'i');
}

// Ordered highest score first so more-specific phrases (e.g. "strongly agree")
// are tested before a looser one (e.g. "agree") could otherwise win by accident.
// Patterns are precompiled once at module load rather than per lookup.
const SCORE_PATTERNS: Array<{ score: number; patterns: RegExp[] }> = [
  {
    score: 5,
    phrases: [
      'excellent',
      'outstanding',
      'exceptional',
      'expert',
      'exceeds expectations',
      'strongly agree',
      'very strong',
      'strong',
    ],
  },
  { score: 4, phrases: ['good', 'above average', 'proficient', 'solid', 'agree'] },
  {
    score: 3,
    phrases: [
      'average',
      'adequate',
      'meets expectations',
      'moderate',
      'satisfactory',
      'neutral',
      'ok',
    ],
  },
  { score: 2, phrases: ['below average', 'weak', 'needs improvement', 'developing', 'limited'] },
  {
    score: 1,
    phrases: ['strongly disagree', 'poor', 'very weak', 'unsatisfactory', 'insufficient', 'none'],
  },
].map(({ score, phrases }) => ({ score, patterns: phrases.map(wordPattern) }));

export function mapToScore(raw: string | undefined): number | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const numericMatch = trimmed.match(/^(\d+(?:\.\d+)?)/);
  if (numericMatch) {
    const value = Number(numericMatch[1]);
    if (!Number.isNaN(value)) return Math.min(5, Math.max(1, value));
  }

  for (const tier of SCORE_PATTERNS) {
    if (tier.patterns.some((pattern) => pattern.test(trimmed))) return tier.score;
  }

  return null;
}

interface SkillDimension {
  key: string;
  label: string;
  match: (header: string) => boolean;
}

const SKILL_DIMENSIONS: SkillDimension[] = [
  { key: 'problem-solving', label: 'Problem Solving', match: (h) => h === 'Problem Solving' },
  { key: 'coding-skills', label: 'Coding Skills', match: (h) => h === 'Coding Skills' },
  {
    key: 'algorithm-knowledge',
    label: 'Algorithms & Data Structures',
    match: (h) => h === 'Algorithm & Data Structure Knowledge',
  },
  {
    key: 'testing-edge-cases',
    label: 'Testing & Edge Cases',
    match: (h) => h === 'Testing & Edge Cases',
  },
  {
    key: 'optimization',
    label: 'Optimization & Trade-offs',
    match: (h) => h === 'Optimization & Trade-offs',
  },
  { key: 'communication', label: 'Communication', match: (h) => h === 'Communication Skills' },
  {
    key: 'decision-making',
    label: 'Decision Making',
    match: (h) => h === 'Decision Making / Judgement',
  },
  {
    key: 'technical-knowledge',
    label: 'Technical Knowledge',
    match: (h) => h === 'Functional & Technical Knowledge',
  },
  {
    key: 'cultural-fit',
    label: 'Cultural Fit',
    match: (h) => h === 'Cultural Fit / Professionalism',
  },
  { key: 'teamwork', label: 'Teamwork', match: (h) => h === 'Teamwork / Collaboration' },
];

function findHeader(headers: string[], predicate: (h: string) => boolean): string | undefined {
  return headers.find(predicate);
}

function tallyValues(
  rows: Record<string, string>[],
  header: string | undefined,
  split = false,
): Tally[] {
  if (!header) return [];
  const counts = new Map<string, number>();

  for (const row of rows) {
    const raw = row[header];
    if (!raw) continue;
    const values = split ? raw.split(',') : [raw];
    for (const value of values) {
      const label = value.trim();
      if (!label) continue;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function collectComments(rows: Record<string, string>[], header: string | undefined): string[] {
  if (!header) return [];
  return rows.map((row) => row[header]?.trim()).filter((value): value is string => Boolean(value));
}

export async function fetchFeedbackRows(csvUrl: string): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: normalizeHeader,
      complete: (results) => resolve(results.data),
      error: (error: Error) => reject(error),
    });
  });
}

export function aggregateFeedback(rows: Record<string, string>[]): FeedbackAggregate {
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

  const unmatchedSkillDimensions: string[] = [];
  const skillAverages: SkillAverage[] = SKILL_DIMENSIONS.map((dimension) => {
    const header = findHeader(headers, dimension.match);
    if (!header) {
      unmatchedSkillDimensions.push(dimension.label);
      return { key: dimension.key, label: dimension.label, average: null, count: 0 };
    }

    const scores = rows
      .map((row) => mapToScore(row[header]))
      .filter((score): score is number => score !== null);

    const average =
      scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;
    return { key: dimension.key, label: dimension.label, average, count: scores.length };
  });

  if (headers.length > 0 && unmatchedSkillDimensions.length > 0) {
    console.warn(
      `Peer feedback: no matching sheet column found for: ${unmatchedSkillDimensions.join(', ')}. ` +
        'Check whether the Google Form question wording changed.',
    );
  }

  const overallRatingHeader = findHeader(headers, (h) => h === 'Overall Performance Rating');
  const overallScores = overallRatingHeader
    ? rows.map((row) => mapToScore(row[overallRatingHeader])).filter((s): s is number => s !== null)
    : [];
  const overallRatingAverage =
    overallScores.length > 0
      ? overallScores.reduce((sum, s) => sum + s, 0) / overallScores.length
      : null;

  const interviewTypeHeader = findHeader(headers, (h) => h === 'Interview Type');
  const recommendationHeader = findHeader(headers, (h) => h === 'Overall Mock Recommendation');
  const confidenceHeader = findHeader(headers, (h) => h === 'Confidence in Recommendation');
  const readinessHeader = findHeader(
    headers,
    (h) => h === 'Based on this mock, how ready is Kaviraj for an interview?',
  );
  const improvementAreaHeader = findHeader(headers, (h) => h === 'Top 3 Areas for Improvement');
  const highlightsHeader = findHeader(
    headers,
    (h) => h === 'Things the Candidate (Kaviraj) Did Well',
  );
  const growthAreasHeader = findHeader(headers, (h) => h === 'Elaborate on Improvement Areas');
  const additionalNotesHeader = findHeader(
    headers,
    (h) => h === 'Additional Observations (Optional)',
  );

  return {
    totalResponses: rows.length,
    skillAverages,
    overallRatingAverage,
    overallRatingCount: overallScores.length,
    interviewTypeCounts: tallyValues(rows, interviewTypeHeader),
    recommendationCounts: tallyValues(rows, recommendationHeader),
    confidenceCounts: tallyValues(rows, confidenceHeader),
    readinessCounts: tallyValues(rows, readinessHeader),
    improvementAreaCounts: tallyValues(rows, improvementAreaHeader, true),
    highlights: collectComments(rows, highlightsHeader),
    growthAreas: collectComments(rows, growthAreasHeader),
    additionalNotes: collectComments(rows, additionalNotesHeader),
  };
}

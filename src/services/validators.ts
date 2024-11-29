import type { AnalysisResult, KeywordAnalysis } from '../types';
import { AnalysisError } from './errors';

export function validateAnalysisResult(result: unknown): asserts result is AnalysisResult {
  if (!result || typeof result !== 'object') {
    throw new AnalysisError('Invalid analysis result format', 500);
  }

  const requiredFields = [
    'title',
    'headings',
    'totalWords',
    'twoWordPhrases',
    'threeWordPhrases',
    'fourWordPhrases',
    'scrapedContent'
  ] as const;

  for (const field of requiredFields) {
    if (!(field in result)) {
      throw new AnalysisError(`Missing required field: ${field}`, 500);
    }
  }

  const r = result as any;

  if (typeof r.title !== 'string' || !r.title.trim()) {
    throw new AnalysisError('Invalid title format', 500);
  }

  if (typeof r.totalWords !== 'number' || r.totalWords < 0) {
    throw new AnalysisError('Invalid word count', 500);
  }

  validateHeadings(r.headings);
  validatePhrases(r.twoWordPhrases, 'twoWordPhrases');
  validatePhrases(r.threeWordPhrases, 'threeWordPhrases');
  validatePhrases(r.fourWordPhrases, 'fourWordPhrases');

  if (typeof r.scrapedContent !== 'string') {
    throw new AnalysisError('Invalid content format', 500);
  }
}

function validateHeadings(headings: unknown): void {
  if (!headings || typeof headings !== 'object') {
    throw new AnalysisError('Invalid headings format', 500);
  }

  const h = headings as any;
  const requiredHeadings = ['h1', 'h2', 'h3', 'h4'] as const;

  for (const heading of requiredHeadings) {
    if (!Array.isArray(h[heading])) {
      throw new AnalysisError(`Invalid ${heading} format`, 500);
    }

    if (!h[heading].every((item: unknown) => typeof item === 'string')) {
      throw new AnalysisError(`Invalid ${heading} content`, 500);
    }
  }
}

function validatePhrases(phrases: unknown, field: string): void {
  if (!Array.isArray(phrases)) {
    throw new AnalysisError(`Invalid ${field} format`, 500);
  }

  for (const phrase of phrases) {
    if (!isValidKeywordAnalysis(phrase)) {
      throw new AnalysisError(`Invalid phrase analysis in ${field}`, 500);
    }
  }
}

function isValidKeywordAnalysis(analysis: unknown): analysis is KeywordAnalysis {
  if (!analysis || typeof analysis !== 'object') {
    return false;
  }

  const a = analysis as any;

  return (
    typeof a.keyword === 'string' &&
    typeof a.count === 'number' &&
    typeof a.density === 'number' &&
    typeof a.prominence === 'number' &&
    a.count >= 0 &&
    a.density >= 0 &&
    a.density <= 1 &&
    a.prominence >= 0 &&
    a.prominence <= 1
  );
}
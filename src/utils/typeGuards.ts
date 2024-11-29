import type { ApiResponse, ApiError, AnalysisResult, PageHeadings, KeywordAnalysis } from '../types';

export function isApiError(response: unknown): response is ApiError {
  if (!response || typeof response !== 'object') {
    return false;
  }

  return (
    'error' in response &&
    typeof (response as ApiError).error === 'string'
  );
}

export function isAnalysisResult(result: unknown): result is AnalysisResult {
  if (!result || typeof result !== 'object') {
    return false;
  }

  const r = result as Partial<AnalysisResult>;

  return (
    typeof r.title === 'string' &&
    isPageHeadings(r.headings) &&
    typeof r.totalWords === 'number' &&
    Array.isArray(r.twoWordPhrases) &&
    r.twoWordPhrases.every(isKeywordAnalysis) &&
    Array.isArray(r.threeWordPhrases) &&
    r.threeWordPhrases.every(isKeywordAnalysis) &&
    Array.isArray(r.fourWordPhrases) &&
    r.fourWordPhrases.every(isKeywordAnalysis) &&
    typeof r.scrapedContent === 'string'
  );
}

function isPageHeadings(headings: unknown): headings is PageHeadings {
  if (!headings || typeof headings !== 'object') {
    return false;
  }

  const h = headings as Partial<PageHeadings>;

  return (
    Array.isArray(h.h1) &&
    Array.isArray(h.h2) &&
    Array.isArray(h.h3) &&
    Array.isArray(h.h4) &&
    h.h1.every((item: unknown) => typeof item === 'string') &&
    h.h2.every((item: unknown) => typeof item === 'string') &&
    h.h3.every((item: unknown) => typeof item === 'string') &&
    h.h4.every((item: unknown) => typeof item === 'string')
  );
}

function isKeywordAnalysis(analysis: unknown): analysis is KeywordAnalysis {
  if (!analysis || typeof analysis !== 'object') {
    return false;
  }

  const a = analysis as Partial<KeywordAnalysis>;

  return (
    typeof a.keyword === 'string' &&
    typeof a.count === 'number' &&
    typeof a.density === 'number' &&
    typeof a.prominence === 'number'
  );
}
import { CONTENT_FILTERS } from '../utils/contentFilters';
import type { AnalysisResult } from '../types';

export function analyzeContent(html: string): AnalysisResult {
  // Remove unwanted content using filters
  let cleanText = html;
  Object.values(CONTENT_FILTERS.patterns).forEach((patterns: RegExp[]) => {
    patterns.forEach((pattern: RegExp) => {
      cleanText = cleanText.replace(pattern, ' ');
    });
  });

  // Process text
  const words = cleanText
    .toLowerCase()
    .split(/\s+/)
    .filter((word: string) => word.length > 2);

  // Generate analysis result
  return {
    title: 'Page Title',
    metaDescription: '',
    headings: { h1: [], h2: [], h3: [], h4: [] },
    totalWords: words.length,
    twoWordPhrases: [],
    threeWordPhrases: [],
    fourWordPhrases: [],
    scrapedContent: cleanText
  };
}
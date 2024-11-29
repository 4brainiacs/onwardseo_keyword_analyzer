import type { Classification } from './classification';
import type { PageHeadings } from './headings';

export interface KeywordAnalysis {
  keyword: string;
  count: number;
  density: number;
  prominence: number;
  semanticScore?: number;
}

export interface AnalysisResult {
  title: string;
  metaDescription: string;
  headings: PageHeadings;
  totalWords: number;
  twoWordPhrases: KeywordAnalysis[];
  threeWordPhrases: KeywordAnalysis[];
  fourWordPhrases: KeywordAnalysis[];
  scrapedContent: string;
  classification?: Classification;
}
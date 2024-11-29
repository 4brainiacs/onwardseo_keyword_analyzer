export interface ProminenceWeights {
  title: number;
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  position: number;
  maxTotal: number;
}

export interface KeywordAnalysis {
  keyword: string;
  count: number;
  density: number;
  prominence: number;
}

export interface PageHeadings {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
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
}

export interface AnalysisRequest {
  url: string;
}
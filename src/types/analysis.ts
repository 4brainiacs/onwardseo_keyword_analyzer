// Core analysis types
export interface AnalysisResult {
  title: string;
  metaDescription: string;
  headings: PageHeadings;
  totalWords: number;
  twoWordPhrases: KeywordAnalysis[];
  threeWordPhrases: KeywordAnalysis[];
  fourWordPhrases: KeywordAnalysis[];
  scrapedContent: string;
  classification?: ContentClassification;
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

export interface ContentClassification {
  primaryCategory: ContentCategory;
  secondaryCategories: ContentCategory[];
}

export interface ContentCategory {
  name: string;
  confidence: number;
  keywords: string[];
}
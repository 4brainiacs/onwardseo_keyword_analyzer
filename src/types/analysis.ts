export interface PageHeadings {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
}

export interface KeywordAnalysis {
  keyword: string;
  count: number;
  density: number;
  prominence: number;
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
  classification?: {
    primaryCategory: {
      name: string;
      confidence: number;
    };
    secondaryCategories?: Array<{
      name: string;
      confidence: number;
    }>;
  };
}
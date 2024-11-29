// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface ApiError {
  error: string;
  details?: string;
  status?: number;
}

// Loading state type
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Analysis types
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
  metaDescription?: string;
  headings: PageHeadings;
  totalWords: number;
  twoWordPhrases: KeywordAnalysis[];
  threeWordPhrases: KeywordAnalysis[];
  fourWordPhrases: KeywordAnalysis[];
  scrapedContent: string;
}

// Component prop types
export interface AnalysisResultsProps {
  result: AnalysisResult;
}

export interface KeywordTableProps {
  keywords: KeywordAnalysis[];
  title: string;
  pageTitle: string;
  headings: PageHeadings;
}

export interface PageStructureProps {
  title: string;
  metaDescription?: string;
  headings: PageHeadings;
}

export interface ScrapedContentProps {
  content: string;
}

export interface UrlInputProps {
  onAnalyze: (url: string) => Promise<void>;
  loadingState: LoadingState;
  error?: Error | null;
}

export type HeadingType = keyof PageHeadings;
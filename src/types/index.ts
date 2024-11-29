import type { Classification } from './classification';
import type { HeadingType, PageHeadings } from './headings';
import type { KeywordAnalysis, AnalysisResult } from './analysis';

// Re-export all types
export type { Classification };
export type { HeadingType, PageHeadings };
export type { KeywordAnalysis, AnalysisResult };

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
  details?: string;
  retryAfter?: number;
  timestamp?: string;
  requestId?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  details?: string;
  status?: number;
  retryAfter?: number;
  code?: string;
  timestamp?: string;
  requestId?: string;
}

// Loading state type
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

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
  classification?: Classification;
}

export interface ScrapedContentProps {
  content: string;
}

export interface UrlInputProps {
  onAnalyze: (url: string) => Promise<void>;
  loadingState: LoadingState;
  error?: Error | null;
}
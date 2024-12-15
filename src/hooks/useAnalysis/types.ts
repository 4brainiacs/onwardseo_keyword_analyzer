import type { AnalysisResult } from '../../types';

export interface UseAnalysisOptions {
  onSuccess?: (data: AnalysisResult) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
}

export interface UseAnalysisState {
  isLoading: boolean;
  error: Error | null;
  result: AnalysisResult | null;
}

export interface UseAnalysisResult {
  analyze: (url: string) => Promise<void>;
  reset: () => void;
  isLoading: boolean;
  error: Error | null;
  result: AnalysisResult | null;
}
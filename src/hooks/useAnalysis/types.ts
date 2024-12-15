import type { AnalysisResult } from '../../types';
import type { AnalysisError } from '../../services/errors';

export interface UseAnalysisOptions {
  onSuccess?: (result: AnalysisResult) => void;
  onError?: (error: AnalysisError) => void;
}

export interface UseAnalysisState {
  isLoading: boolean;
  error: AnalysisError | null;
  result: AnalysisResult | null;
}
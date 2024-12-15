import type { AnalysisError } from '../../errors';

export interface ApiState<T> {
  isLoading: boolean;
  error: AnalysisError | null;
  data: T | null;
}
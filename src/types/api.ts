import type { AnalysisError } from '../services/errors';

export interface ApiState<T> {
  isLoading: boolean;
  error: AnalysisError | null;
  data: T | null;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: string;
  };
}
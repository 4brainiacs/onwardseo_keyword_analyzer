import type { AnalysisResult } from '../../types';

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error' | 'retrying';

export interface ApiState {
  status: ApiStatus;
  error: Error | null;
  data: AnalysisResult | null;
  retryCount: number;
  lastAttempt?: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  retryAfter?: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
}
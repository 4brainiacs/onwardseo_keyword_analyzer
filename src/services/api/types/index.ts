export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  status?: number;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
  RETRYING = 'retrying'
}

export type { ApiConfig } from '../../types/api';
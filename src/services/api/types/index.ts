export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  status?: number;
}

export interface ApiError {
  message: string;
  details?: string;
  status: number;
  retryable: boolean;
  retryAfter?: number;
  code?: string;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
  RETRYING = 'retrying'
}

export interface ApiState<T> {
  status: LoadingState;
  data: T | null;
  error: Error | null;
  retryCount: number;
}
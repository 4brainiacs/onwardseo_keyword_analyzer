// Response types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp?: string;
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string;
  status?: number;
  retryable?: boolean;
  retryAfter?: number;
  code?: string;
  timestamp?: string;
  requestId?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Configuration types
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

// State types
export type LoadingState = 'idle' | 'loading' | 'retrying' | 'success' | 'error';

export interface RequestState {
  status: LoadingState;
  error: Error | null;
  retryCount: number;
  lastAttempt?: Date;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  timestamp?: string;
  requestId?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: string;
  code?: string;
  retryable?: boolean;
  retryAfter?: number;
  timestamp?: string;
  requestId?: string;
}

export type LoadingState = 'idle' | 'loading' | 'retrying' | 'success' | 'error';

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  validateStatus?: (status: number) => boolean;
}
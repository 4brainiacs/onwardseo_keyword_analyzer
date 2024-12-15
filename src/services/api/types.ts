export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

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
  code: string;
  message: string;
  details?: string;
  status: number;
  retryable: boolean;
  retryAfter?: number;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}
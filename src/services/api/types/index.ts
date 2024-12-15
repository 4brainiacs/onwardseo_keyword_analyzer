export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  retryAfter?: number;
  timestamp?: string;
  requestId?: string;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

export type { RetryConfig } from '../handlers/RetryHandler';
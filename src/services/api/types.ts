export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  timestamp?: string;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers?: Record<string, string>;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}
// API related types
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
  code: string;
  details?: string;
  status: number;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers?: Record<string, string>;
}
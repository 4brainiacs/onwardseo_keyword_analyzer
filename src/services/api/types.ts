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

export interface ApiError {
  message: string;
  details?: string;
  status: number;
  retryable: boolean;
  retryAfter?: number;
}
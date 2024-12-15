export interface ApiResponse<T = unknown> {
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
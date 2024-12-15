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
  retryable?: boolean;
  retryAfter?: number;
  timestamp?: string;
  requestId?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
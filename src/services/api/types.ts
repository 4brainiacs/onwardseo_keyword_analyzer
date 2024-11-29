export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
  details?: string;
  retryAfter?: number;
  timestamp?: string;
  requestId?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: string;
  status?: number;
  retryAfter?: number;
  code?: string;
  timestamp?: string;
  requestId?: string;
}

export type LoadingState = 'idle' | 'loading' | 'retrying' | 'success' | 'error';

export interface RequestState {
  status: LoadingState;
  error?: Error | null;
  retryCount: number;
  lastAttempt?: Date;
  requestId?: string;
}

export type { ApiResponse as ApiResponseType };
export type { ApiError as ApiErrorType };
export * from './responses';
export * from './validation';
export * from './retry';
export * from './requests';

export type LoadingState = 'idle' | 'loading' | 'retrying' | 'success' | 'error';

export interface ApiState<T = unknown> {
  status: LoadingState;
  error: Error | null;
  data: T | null;
  retryCount: number;
  lastAttempt?: Date;
}

export interface ApiStatus {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

// Re-export common types
export type { ApiResponse } from './responses';
export type { ValidationResult, ErrorMetadata } from './validation';
export type { RetryConfig, RetryContext } from './retry';
export type { RequestConfig, ApiClientConfig } from './requests';
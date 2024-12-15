export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

export interface RetryContext {
  attempt: number;
  error: unknown;
  startTime: number;
  retryCount: number;
}

export interface RetryOptions {
  shouldRetry?: (error: unknown, context: RetryContext) => boolean;
  onRetry?: (context: RetryContext) => void;
}
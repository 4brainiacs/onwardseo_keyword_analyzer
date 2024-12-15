export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  shouldRetry: (error: unknown, attempt: number) => boolean;
}
export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}
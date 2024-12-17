export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  validateStatus?: (status: number) => boolean;
  metadata?: Record<string, unknown>;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  retryConfig: RetryConfig;
  headers?: Record<string, string>;
}
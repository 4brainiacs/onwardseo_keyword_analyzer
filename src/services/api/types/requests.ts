```typescript
export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  validateStatus?: (status: number) => boolean;
  metadata?: Record<string, unknown>;
}

export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  shouldRetry: (error: unknown, attempt: number) => boolean;
}

export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  retryConfig: RetryConfig;
  headers?: Record<string, string>;
}
```
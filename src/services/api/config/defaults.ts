```typescript
import { StatusCodes } from 'http-status-codes';
import type { ApiClientConfig, RetryConfig } from '../types/requests';

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  shouldRetry: (error: unknown, attempt: number) => {
    if (attempt >= 3) return false;
    
    if (error instanceof Error) {
      const status = (error as any).status;
      return status >= 500 || status === StatusCodes.TOO_MANY_REQUESTS;
    }
    
    return false;
  }
};

export const DEFAULT_API_CONFIG: ApiClientConfig = {
  baseUrl: '/.netlify/functions',
  timeout: 30000,
  retryConfig: DEFAULT_RETRY_CONFIG,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export const CONTENT_TYPES = {
  JSON: 'application/json',
  HTML: 'text/html'
} as const;

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
} as const;
```
```typescript
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  ANALYSIS_ERROR = 'ANALYSIS_ERROR',
  SCRAPING_ERROR = 'SCRAPING_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  REQUEST_TIMEOUT = 'REQUEST_TIMEOUT',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_FIELD = 'MISSING_FIELD',
  TYPE_ERROR = 'TYPE_ERROR',
  CONSTRAINT_ERROR = 'CONSTRAINT_ERROR',
  HTML_RESPONSE = 'HTML_RESPONSE'
}

export interface ErrorMetadata {
  code: ErrorCode;
  status?: number;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  requestId?: string;
  context?: Record<string, unknown>;
}

export interface ErrorResponse {
  message?: string;
  details?: string;
  status?: number;
}
```
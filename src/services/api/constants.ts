```typescript
export const API_DEFAULTS = {
  BASE_URL: '/.netlify/functions',
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  MAX_RETRY_DELAY: 10000
};

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  RATE_LIMIT: 429,
  SERVER_ERROR: 500
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT: 'Request timed out',
  INVALID_RESPONSE: 'Invalid response format',
  INVALID_JSON: 'Invalid JSON response',
  SERVER_ERROR: 'Server error occurred',
  HTML_RESPONSE: 'Server returned HTML instead of JSON',
  BAD_REQUEST: 'Bad request'
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
  HTML: 'text/html'
} as const;
```
export const API_CONSTANTS = {
  TIMEOUTS: {
    DEFAULT: 30000,
    RETRY: 5000,
    MAX_RETRY: 30000,
    RATE_LIMIT: 15000
  },
  HEADERS: {
    CONTENT_TYPE: 'Content-Type',
    ACCEPT: 'Accept',
    RETRY_AFTER: 'Retry-After',
    REQUEST_ID: 'X-Request-ID'
  },
  CONTENT_TYPES: {
    JSON: 'application/json',
    HTML: 'text/html'
  }
} as const;

export type ApiConstants = typeof API_CONSTANTS;
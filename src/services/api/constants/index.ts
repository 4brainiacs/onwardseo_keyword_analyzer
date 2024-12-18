export * from './http';
export * from './errors';
export * from './validation';

export const API_CONSTANTS = {
  HEADERS: {
    CONTENT_TYPE: 'content-type',
    ACCEPT: 'accept',
    REQUEST_ID: 'x-request-id'
  },
  CONTENT_TYPES: {
    JSON: 'application/json',
    HTML: 'text/html'
  },
  TIMEOUTS: {
    DEFAULT: 30000,
    RETRY: 5000,
    MAX_RETRY: 30000,
    RATE_LIMIT: 15000
  },
  STATUS_CODES: {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    RATE_LIMIT: 429,
    SERVER_ERROR: 500
  }
} as const;
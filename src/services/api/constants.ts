export const API_CONSTANTS = {
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
  },
  ERROR_CODES: {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT',
    INVALID_RESPONSE: 'INVALID_RESPONSE',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    RATE_LIMIT: 'RATE_LIMIT'
  },
  HEADERS: {
    CONTENT_TYPE: 'Content-Type',
    ACCEPT: 'Accept',
    RETRY_AFTER: 'Retry-After'
  },
  CONTENT_TYPES: {
    JSON: 'application/json',
    HTML: 'text/html'
  }
} as const;

export const ERROR_MESSAGES = {
  NETWORK: {
    TIMEOUT: 'Request timed out',
    CONNECTION: 'Network connection error',
    ABORT: 'Request was aborted'
  },
  VALIDATION: {
    INVALID_JSON: 'Invalid JSON response',
    INVALID_CONTENT: 'Invalid content type',
    EMPTY_RESPONSE: 'Empty response received',
    MALFORMED_RESPONSE: 'Malformed response received'
  },
  SERVER: {
    INTERNAL_ERROR: 'Internal server error',
    RATE_LIMIT: 'Rate limit exceeded',
    MAINTENANCE: 'Server is under maintenance'
  },
  CLIENT: {
    INVALID_REQUEST: 'Invalid request',
    UNAUTHORIZED: 'Unauthorized request',
    NOT_FOUND: 'Resource not found'
  }
} as const;
export const API_DEFAULTS = {
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  MAX_BODY_SIZE: 1024 * 1024, // 1MB
  RETRY_DELAY: 1000,
  MAX_RETRY_DELAY: 10000,
  RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504]
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
  HTML: 'text/html',
  FORM: 'application/x-www-form-urlencoded'
} as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Network error occurred',
  TIMEOUT: 'Request timed out',
  INVALID_JSON: 'Invalid JSON response',
  SERVER_ERROR: 'Server error occurred',
  VALIDATION: 'Validation error',
  UNAUTHORIZED: 'Unauthorized',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  RATE_LIMIT: 'Rate limit exceeded'
} as const;
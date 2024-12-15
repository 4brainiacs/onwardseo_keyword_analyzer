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
    MALFORMED_RESPONSE: 'Malformed response received',
    MISSING_CONTENT_TYPE: 'Missing content type header',
    INVALID_RESPONSE: 'Invalid response format',
    HTML_RESPONSE: 'HTML response received instead of JSON'
  },
  SERVER: {
    INTERNAL_ERROR: 'Internal server error',
    RATE_LIMIT: 'Rate limit exceeded',
    MAINTENANCE: 'Server is under maintenance'
  }
} as const;
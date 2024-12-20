export const ERROR_MESSAGES = {
  NETWORK: {
    TIMEOUT: 'Request timed out',
    CONNECTION: 'Network connection error',
    ABORT: 'Request was aborted',
    TIMEOUT_DETAILS: 'The request took too long to complete'
  },
  VALIDATION: {
    INVALID_JSON: 'Invalid JSON response',
    INVALID_CONTENT: 'Invalid content type',
    EMPTY_RESPONSE: 'Empty response received',
    MALFORMED_RESPONSE: 'Malformed response received',
    MISSING_CONTENT_TYPE: 'Missing content type header',
    INVALID_RESPONSE: 'Invalid response format',
    HTML_RESPONSE: 'HTML response received instead of JSON',
    MISSING_URL: 'URL is required',
    INVALID_URL: 'Invalid URL format',
    INVALID_PROTOCOL: 'URL must use HTTP or HTTPS protocol',
    PRIVATE_URL: 'Local and private URLs are not allowed',
    INVALID_HOSTNAME: 'Invalid hostname format',
    URL_TOO_LONG: 'URL exceeds maximum length of 2000 characters',
    ERROR_PAGE: 'Error page detected'
  },
  SERVER: {
    INTERNAL_ERROR: 'Internal server error',
    RATE_LIMIT: 'Rate limit exceeded',
    MAINTENANCE: 'Server is under maintenance'
  }
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  UNSUPPORTED_MEDIA_TYPE: 415,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;
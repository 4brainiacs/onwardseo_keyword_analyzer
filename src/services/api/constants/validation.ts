export const ERROR_MESSAGES = {
  VALIDATION: {
    MISSING_URL: 'URL is required',
    INVALID_URL: 'Invalid URL format',
    INVALID_PROTOCOL: 'URL must use HTTP or HTTPS protocol',
    PRIVATE_URL: 'Local and private URLs are not allowed',
    INVALID_HOSTNAME: 'Invalid hostname format',
    URL_TOO_LONG: 'URL exceeds maximum length of 2000 characters',
    EMPTY_RESPONSE: 'Empty response received',
    INVALID_CONTENT: 'Invalid content type',
    INVALID_JSON: 'Invalid JSON response',
    INVALID_RESPONSE: 'Invalid response format',
    ERROR_PAGE: 'Error page detected'
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
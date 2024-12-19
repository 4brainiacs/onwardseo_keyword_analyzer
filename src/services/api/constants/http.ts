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
  }
} as const;
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
  HTML: 'text/html',
  FORM: 'application/x-www-form-urlencoded'
} as const;

export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
  RETRY_AFTER: 'Retry-After',
  REQUEST_ID: 'X-Request-ID'
} as const;

// Type exports
export type HttpStatus = typeof HTTP_STATUS;
export type ContentTypes = typeof CONTENT_TYPES;
export type Headers = typeof HEADERS;
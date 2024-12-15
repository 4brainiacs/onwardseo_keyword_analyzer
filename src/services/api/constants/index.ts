import { HTTP_STATUS, CONTENT_TYPES, HEADERS } from './http';
import { ERROR_MESSAGES } from './errors';

export const API_CONSTANTS = {
  TIMEOUTS: {
    DEFAULT: 30000,
    RETRY: 5000,
    MAX_RETRY: 30000,
    RATE_LIMIT: 15000
  },
  STATUS_CODES: HTTP_STATUS,
  CONTENT_TYPES,
  HEADERS,
  ERROR_MESSAGES
} as const;

// Type exports
export type ApiConstants = typeof API_CONSTANTS;
export type ErrorMessages = typeof ERROR_MESSAGES;
export type { HttpStatus, ContentTypes, Headers } from './http';

// Constant exports
export { HTTP_STATUS, CONTENT_TYPES, HEADERS, ERROR_MESSAGES };

// Default export
export default API_CONSTANTS;
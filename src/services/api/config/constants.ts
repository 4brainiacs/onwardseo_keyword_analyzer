export const API_CONFIG = {
  timeout: 30000,
  retryConfig: {
    maxAttempts: 3,
    baseDelay: 2000,
    maxDelay: 10000
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

export const ERROR_MESSAGES = {
  INVALID_CONTENT_TYPE: 'Invalid content type',
  INVALID_RESPONSE: 'Invalid response format',
  MISSING_FIELD: 'Missing required field',
  INVALID_DATA: 'Invalid data format',
  REQUEST_FAILED: 'Request failed',
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT: 'Request timed out'
} as const;
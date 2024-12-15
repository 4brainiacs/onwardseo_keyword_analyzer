export const DEFAULT_CONFIG = {
  baseUrl: '/.netlify/functions',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  maxRetryDelay: 10000
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT: 'Request timed out',
  INVALID_RESPONSE: 'Invalid response format',
  SERVER_ERROR: 'Server error occurred'
} as const;
export const API_ENDPOINTS = {
  analyze: '/.netlify/functions/analyze'
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
} as const;

export const API_TIMEOUTS = {
  default: 30000,
  retry: 5000,
  maxRetry: 30000
} as const;
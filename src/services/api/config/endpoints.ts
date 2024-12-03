export const API_ENDPOINTS = {
  analyze: '/.netlify/functions/analyze'
} as const;

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const;

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
} as const;

export const API_TIMEOUTS = {
  default: 30000,
  long: 60000
} as const;

export const API_RETRY = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000
} as const;
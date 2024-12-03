export const apiConfig = {
  baseUrl: '/.netlify/functions',
  timeout: 30000,
  retries: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Request-ID',
  'Content-Type': 'application/json'
};
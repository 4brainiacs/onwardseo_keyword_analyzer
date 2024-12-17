export const API_CONFIG = {
  baseUrl: import.meta.env.PROD 
    ? '/.netlify/functions'
    : 'http://localhost:8888/.netlify/functions',
  endpoints: {
    analyze: '/analyze'
  },
  timeout: 30000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
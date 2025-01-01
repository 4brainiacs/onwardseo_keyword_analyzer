export const API_CONFIG = {
  baseUrl: '/.netlify/functions',
  timeout: 30000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
import { env } from './environment';

export const API_CONFIG = {
  baseUrl: '/.netlify/functions',
  timeout: 30000,
  retries: env.app.isProd ? 3 : 1,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
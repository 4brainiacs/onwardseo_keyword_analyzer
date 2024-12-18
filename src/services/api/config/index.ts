import { env } from '../../../config/environment';

export const API_CONFIG = {
  baseUrl: env.api.baseUrl,
  timeout: 30000,
  retries: env.app.isProd ? 3 : 1,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

export type { ApiConfig } from '../types';
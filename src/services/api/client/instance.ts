import { ApiClient } from './ApiClient';
import type { ApiConfig } from '../types/config';

const config: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || '/.netlify/functions',
  timeout: 30000,
  retries: import.meta.env.PROD ? 3 : 1
};

export const apiClient = new ApiClient(config);
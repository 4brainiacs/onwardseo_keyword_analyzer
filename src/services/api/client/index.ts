import { ApiClient } from './ApiClient';
import type { ApiConfig } from '../types';

const config: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || '/.netlify/functions',
  timeout: 30000,
  retries: import.meta.env.PROD ? 3 : 1
};

const apiClient = new ApiClient(config);

export { apiClient };
export type { ApiClient };
export const request = apiClient.request.bind(apiClient);
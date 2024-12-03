import { API_DEFAULTS, CONTENT_TYPES } from '../constants';
import type { RequestConfig } from '../types';

export function createRequestConfig(config: RequestConfig = {}): RequestInit {
  const controller = new AbortController();
  
  if (config.timeout) {
    setTimeout(() => controller.abort(), config.timeout);
  }

  const headers = new Headers({
    'Accept': CONTENT_TYPES.JSON,
    'Content-Type': CONTENT_TYPES.JSON,
    ...config.headers
  });

  return {
    ...config,
    signal: controller.signal,
    headers,
    credentials: 'include',
    mode: 'cors'
  };
}

export function buildUrl(baseUrl: string, path: string): string {
  // Handle both absolute and relative paths
  if (path.startsWith('http')) {
    return path;
  }
  
  // Ensure proper URL joining
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${base}${cleanPath}`;
}
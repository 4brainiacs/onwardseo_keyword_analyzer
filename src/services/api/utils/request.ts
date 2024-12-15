import { API_CONSTANTS } from '../constants';
import type { RequestConfig } from '../types';

export function createRequestConfig(config: RequestConfig = {}): RequestInit {
  const controller = new AbortController();
  
  if (config.timeout) {
    setTimeout(() => controller.abort(), config.timeout);
  }

  return {
    ...config,
    signal: controller.signal,
    headers: {
      [API_CONSTANTS.HEADERS.CONTENT_TYPE]: API_CONSTANTS.CONTENT_TYPES.JSON,
      [API_CONSTANTS.HEADERS.ACCEPT]: API_CONSTANTS.CONTENT_TYPES.JSON,
      ...config.headers
    }
  };
}
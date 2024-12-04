import { CONTENT_TYPES } from '../constants';
import type { RequestConfig } from '../types';

export function buildRequest(config: RequestConfig = {}): RequestInit {
  return {
    ...config,
    headers: {
      'Accept': CONTENT_TYPES.JSON,
      'Content-Type': CONTENT_TYPES.JSON,
      ...config.headers
    },
    credentials: 'same-origin',
    mode: 'cors'
  };
}
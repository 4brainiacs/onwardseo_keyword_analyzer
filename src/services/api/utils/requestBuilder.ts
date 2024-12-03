import { API_HEADERS } from '../config/endpoints';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  timeout?: number;
}

export function buildRequest(options: RequestOptions = {}): RequestInit {
  const { params, timeout, ...requestOptions } = options;

  const controller = new AbortController();
  if (timeout) {
    setTimeout(() => controller.abort(), timeout);
  }

  return {
    ...requestOptions,
    signal: controller.signal,
    headers: {
      ...API_HEADERS,
      ...requestOptions.headers
    }
  };
}

export function buildUrl(baseUrl: string, params?: Record<string, string>): string {
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
import { z } from 'zod';

const apiConfigSchema = z.object({
  baseUrl: z.string().min(1),
  timeout: z.number().min(1000),
  retries: z.number().min(0),
  retryConfig: z.object({
    maxAttempts: z.number().min(1),
    baseDelay: z.number().min(100),
    maxDelay: z.number().min(1000)
  })
});

function getBaseUrl(): string {
  // First check runtime config
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__?.VITE_API_URL) {
    return window.__RUNTIME_CONFIG__.VITE_API_URL;
  }

  // Then check environment variables
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Finally use default based on environment
  return import.meta.env.DEV 
    ? 'http://localhost:8888/.netlify/functions'
    : '/.netlify/functions';
}

export const API_CONFIG = {
  baseUrl: getBaseUrl(),
  timeout: 30000,
  retries: import.meta.env.PROD ? 3 : 1,
  retryConfig: {
    maxAttempts: import.meta.env.PROD ? 3 : 1,
    baseDelay: 2000,
    maxDelay: 10000
  }
};

export type ApiConfig = z.infer<typeof apiConfigSchema>;
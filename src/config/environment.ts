import { z } from 'zod';

const envSchema = z.object({
  api: z.object({
    baseUrl: z.string().min(1).refine(
      (url) => url.startsWith('/') || url.startsWith('http'),
      { message: 'API URL must start with / or http' }
    )
  }),
  scrapingBee: z.object({
    apiKey: z.string().optional(),
    baseUrl: z.string().url()
  }),
  app: z.object({
    env: z.enum(['development', 'production', 'test']),
    isDev: z.boolean(),
    isProd: z.boolean(),
    isTest: z.boolean()
  })
});

type Environment = z.infer<typeof envSchema>;

function getApiUrl(): string {
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

function validateEnvironment(): Environment {
  const mode = import.meta.env.MODE || 'development';
  
  const config = {
    api: {
      baseUrl: getApiUrl()
    },
    app: {
      env: mode as Environment['app']['env'],
      isDev: mode === 'development',
      isProd: mode === 'production',
      isTest: mode === 'test'
    },
    scrapingBee: {
      apiKey: import.meta.env.VITE_SCRAPINGBEE_API_KEY,
      baseUrl: 'https://app.scrapingbee.com/api/v1'
    }
  };

  return envSchema.parse(config);
}

export const env = validateEnvironment();
export type { Environment };
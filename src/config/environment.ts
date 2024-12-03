import { z } from 'zod';
import { logger } from '../utils/logger';

const envSchema = z.object({
  api: z.object({
    baseUrl: z.string().min(1)
  }),
  app: z.object({
    env: z.enum(['development', 'production', 'test']).default('development'),
    isDev: z.boolean(),
    isProd: z.boolean(),
    isTest: z.boolean()
  })
});

type Environment = z.infer<typeof envSchema>;

function getApiUrl(): string {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__?.VITE_API_URL) {
    return window.__RUNTIME_CONFIG__.VITE_API_URL;
  }
  return import.meta.env.VITE_API_URL || '/.netlify/functions';
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
    }
  };

  try {
    return envSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Environment validation failed:', {
        errors: error.errors,
        config: {
          ...config,
          api: {
            baseUrl: config.api.baseUrl || 'Not set'
          }
        }
      });
    }
    throw new Error('Invalid environment configuration');
  }
}

export const env = validateEnvironment();

export type { Environment };
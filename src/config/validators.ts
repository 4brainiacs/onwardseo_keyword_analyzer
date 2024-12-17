import { z } from 'zod';

const envSchema = z.object({
  api: z.object({
    baseUrl: z.string().min(1),
    timeout: z.number().min(1000).default(30000)
  }),
  app: z.object({
    env: z.enum(['development', 'production', 'test']),
    isDev: z.boolean(),
    isProd: z.boolean(),
    isTest: z.boolean()
  })
});

export function validateEnvironment() {
  const config = {
    api: {
      baseUrl: import.meta.env.VITE_API_URL || '/.netlify/functions',
      timeout: 30000
    },
    app: {
      env: import.meta.env.MODE as 'development' | 'production' | 'test',
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD,
      isTest: import.meta.env.MODE === 'test'
    }
  };

  return envSchema.parse(config);
}
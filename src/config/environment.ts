import { validateEnvironment } from './validators';

interface Environment {
  scrapingBee: {
    apiKey: string;
    baseUrl: string;
  };
  app: {
    env: 'development' | 'production' | 'test';
    isDev: boolean;
    isProd: boolean;
    isTest: boolean;
  };
}

export const env = validateEnvironment();

export type { Environment };
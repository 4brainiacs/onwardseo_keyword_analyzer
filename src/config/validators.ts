import { Environment } from './environment';

export function validateEnvironment(): Environment {
  const apiKey = import.meta.env.VITE_SCRAPINGBEE_API_KEY || '';
  const mode = import.meta.env.MODE || 'development';
  
  if (!['development', 'production', 'test'].includes(mode)) {
    throw new Error('Invalid MODE environment variable');
  }

  return {
    api: {
      baseUrl: import.meta.env.VITE_API_URL || '/.netlify/functions'
    },
    scrapingBee: {
      apiKey,
      baseUrl: 'https://app.scrapingbee.com/api/v1'
    },
    app: {
      env: mode as Environment['app']['env'],
      isDev: mode === 'development',
      isProd: mode === 'production',
      isTest: mode === 'test'
    }
  };
}
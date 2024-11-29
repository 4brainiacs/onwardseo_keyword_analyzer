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

function validateEnvironment(): Environment {
  const env = import.meta.env;
  const apiKey = env.VITE_SCRAPINGBEE_API_KEY;
  
  if (!apiKey) {
    throw new Error('VITE_SCRAPINGBEE_API_KEY environment variable is required');
  }

  const mode = env.MODE as Environment['app']['env'];
  if (!['development', 'production', 'test'].includes(mode)) {
    throw new Error('Invalid MODE environment variable');
  }

  return {
    scrapingBee: {
      apiKey,
      baseUrl: 'https://app.scrapingbee.com/api/v1'
    },
    app: {
      env: mode,
      isDev: mode === 'development',
      isProd: mode === 'production',
      isTest: mode === 'test'
    }
  };
}

export const environment = validateEnvironment();
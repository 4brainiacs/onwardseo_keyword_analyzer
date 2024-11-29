import { beforeAll } from 'vitest';
import { validateEnvironment } from '../../config/validators';

beforeAll(() => {
  const env = validateEnvironment();
  if (!env.scrapingBee.apiKey) {
    throw new Error('VITE_SCRAPINGBEE_API_KEY environment variable is required for integration tests');
  }
});
import { beforeAll } from 'vitest';
import { env } from '../../config/environment';

beforeAll(() => {
  if (!env.scrapingBeeApiKey) {
    throw new Error('VITE_SCRAPINGBEE_API_KEY environment variable is required for integration tests');
  }
});
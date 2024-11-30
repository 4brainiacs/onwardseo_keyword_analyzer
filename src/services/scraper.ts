import { decode } from 'html-entities';
import { fetchApi } from './api';
import { logger } from '../utils/logger';

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    logger.info('Starting webpage scraping', { url });
    const response = await fetchApi<{ html: string }>('/analyze', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
    return decode(response.html);
  } catch (error) {
    logger.error('Scraping failed', { error, url });
    throw error;
  }
}
import { decode } from 'html-entities';
import { fetchApi } from './api';
import { logger } from '../utils/logger';

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    logger.info('Starting webpage scraping', { url });
    const response = await fetchApi<{ data: string }>('/scrape', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
    return decode(response.data);
  } catch (error) {
    logger.error('Scraping failed', { error, url });
    throw error;
  }
}
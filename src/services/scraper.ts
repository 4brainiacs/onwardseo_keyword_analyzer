import { decode } from 'html-entities';
import { logger } from '../utils/logger';
import { fetchApi } from './api';

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    logger.info('Starting webpage scraping', { url });
    
    const response = await fetchApi<{ html: string }>('/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!response?.html) {
      throw new Error('Invalid response from scraping service');
    }

    logger.info('Scraping successful');
    return decode(response.html);
  } catch (error) {
    logger.error('Scraping failed:', error);
    throw error;
  }
}
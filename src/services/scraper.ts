import { decode } from 'html-entities';
import { fetchApi } from './api';
import { logger } from '../utils/logger';

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    logger.info('Starting webpage scraping', { url });
    console.log('Scraping URL:', url);
    
    const response = await fetchApi<{ html: string }>('/scrape', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
    
    console.log('Scraping response received');
    return decode(response.html);
  } catch (error) {
    logger.error('Scraping failed', { error, url });
    throw error;
  }
}
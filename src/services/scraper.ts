import { decode } from 'html-entities';
import { scrapingService } from './scraping/scrapingService';
import { logger } from '../utils/logger';

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    logger.info('Starting webpage scraping', { url });
    const html = await scrapingService.scrapeWebpage(url);
    return decode(html);
  } catch (error) {
    logger.error('Scraping failed', { error, url });
    throw error;
  }
}
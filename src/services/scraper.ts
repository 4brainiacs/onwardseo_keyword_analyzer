import { decode } from 'html-entities';
import { logger } from '../utils/logger';

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    logger.info('Starting webpage scraping', { url });
    console.log('Scraping URL:', url);
    
    const response = await fetch('/.netlify/functions/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to scrape webpage');
    }

    const data = await response.json();
    if (!data.success || !data.data?.html) {
      throw new Error('Invalid response from scraping service');
    }

    console.log('Scraping successful');
    return decode(data.data.html);
  } catch (error) {
    logger.error('Scraping failed', { error, url });
    throw error;
  }
}
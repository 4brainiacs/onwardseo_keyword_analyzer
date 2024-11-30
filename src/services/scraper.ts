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

    console.log('Response status:', response.status);
    const data = await response.text();
    console.log('Raw response:', data);

    if (!response.ok) {
      throw new Error(data || 'Failed to scrape webpage');
    }

    try {
      const jsonData = JSON.parse(data);
      if (!jsonData.success || !jsonData.data?.html) {
        throw new Error('Invalid response from scraping service');
      }
      console.log('Scraping successful');
      return decode(jsonData.data.html);
    } catch (e) {
      console.error('JSON parse error:', e);
      throw new Error('Invalid response format from scraping service');
    }
  } catch (error) {
    console.error('Scraping failed:', error);
    throw error;
  }
}
import axios from 'axios';
import { logger } from '../../utils/logger';

export class ScrapingService {
  constructor() {
    this.apiKey = process.env.SCRAPINGBEE_API_KEY;
    if (!this.apiKey) {
      throw new Error('SCRAPINGBEE_API_KEY is required');
    }
  }

  async scrapeWebpage(url) {
    try {
      logger.info('Starting webpage scraping', { url });

      const params = new URLSearchParams({
        api_key: this.apiKey,
        url: url,
        render_js: 'false',
        premium_proxy: 'true',
        block_ads: 'true',
        block_resources: 'true',
        country_code: 'us',
        timeout: '30000'
      });

      const response = await axios({
        method: 'GET',
        url: `https://app.scrapingbee.com/api/v1?${params.toString()}`,
        timeout: 30000,
        responseType: 'text',
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.5'
        },
        validateStatus: null
      });

      if (!response.data) {
        throw new Error('Empty response from ScrapingBee');
      }

      if (response.status !== 200) {
        throw new Error(`ScrapingBee returned status ${response.status}`);
      }

      return response.data;
    } catch (error) {
      logger.error('Scraping failed:', error);
      throw new Error(`Failed to scrape webpage: ${error.message}`);
    }
  }
}

export const scrapingService = new ScrapingService();
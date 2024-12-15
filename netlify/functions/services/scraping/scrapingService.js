import axios from 'axios';
import { logger } from '../../utils/logger';

export class ScrapingService {
  constructor() {
    this.apiKey = process.env.SCRAPINGBEE_API_KEY;
    if (!this.apiKey) {
      throw new Error('SCRAPINGBEE_API_KEY is required');
    }
    this.baseUrl = 'https://app.scrapingbee.com/api/v1';
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
        url: `${this.baseUrl}?${params.toString()}`,
        timeout: 30000,
        maxContentLength: 50 * 1024 * 1024,
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate'
        },
        validateStatus: (status) => status === 200,
        responseType: 'text'
      });

      if (!response.data) {
        throw new Error('Empty response from ScrapingBee');
      }

      // Validate HTML content
      const content = response.data.toString().trim();
      if (!content.startsWith('<!DOCTYPE') && !content.startsWith('<html')) {
        throw new Error('Invalid HTML response from ScrapingBee');
      }

      return content;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;
        
        if (status === 401) {
          throw new Error('Invalid ScrapingBee API key');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        
        throw new Error(`ScrapingBee error (${status}): ${message}`);
      }

      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out');
      }

      logger.error('Scraping failed:', error);
      throw new Error(`Failed to scrape webpage: ${error.message}`);
    }
  }
}

export const scrapingService = new ScrapingService();
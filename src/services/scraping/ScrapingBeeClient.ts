import axios from 'axios';
import { logger } from '../../utils/logger';

interface ScrapingBeeResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class ScrapingBeeClient {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://app.scrapingbee.com/api/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_SCRAPINGBEE_API_KEY || '';
    if (!this.apiKey) {
      logger.error('ScrapingBee API key not found');
      throw new Error('ScrapingBee API key is required');
    }
  }

  async scrape(url: string): Promise<ScrapingBeeResponse> {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      url: url,
      render_js: 'true',
      premium_proxy: 'true',
      stealth_proxy: 'true',
      country_code: 'us',
      block_ads: 'true',
      wait: '8000',
      wait_for: 'body',
      timeout: '60000'
    });

    try {
      const response = await axios.get(`${this.baseUrl}?${params.toString()}`, {
        timeout: 65000,
        maxContentLength: 50 * 1024 * 1024,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      logger.error('ScrapingBee request failed', { error });
      return {
        success: false,
        error: error.message
      };
    }
  }
}
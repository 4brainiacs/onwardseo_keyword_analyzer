import axios from 'axios';
import { logger } from '../../utils/logger';

interface ScrapingBeeConfig {
  apiKey: string;
  timeout: number;
  maxContentSize: number;
  retryCount: number;
}

interface ScrapingOptions {
  premiumProxy?: boolean;
  stealthProxy?: boolean;
  countryCode?: string;
  waitTime?: number;
  customJs?: string;
}

export class ScrapingBeeService {
  private readonly API_URL = 'https://app.scrapingbee.com/api/v1';
  private config: ScrapingBeeConfig;

  constructor(config: Partial<ScrapingBeeConfig> = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.SCRAPINGBEE_API_KEY || '',
      timeout: config.timeout || 60000,
      maxContentSize: config.maxContentSize || 50 * 1024 * 1024,
      retryCount: config.retryCount || 3
    };
  }

  async scrape(url: string, options: ScrapingOptions = {}) {
    const params = this.buildParams(url, options);
    
    try {
      logger.info('Initiating ScrapingBee request', { url });

      const response = await axios({
        method: 'GET',
        url: `${this.API_URL}?${params.toString()}`,
        timeout: this.config.timeout,
        maxContentLength: this.config.maxContentSize,
        validateStatus: () => true,
        headers: this.getHeaders()
      });

      this.validateResponse(response);
      return response.data;

    } catch (error: any) {
      logger.error('ScrapingBee request failed', { 
        error: error.message,
        url,
        status: error.response?.status 
      });
      throw this.handleError(error);
    }
  }

  private buildParams(url: string, options: ScrapingOptions): URLSearchParams {
    const params = new URLSearchParams({
      api_key: this.config.apiKey,
      url: url,
      render_js: 'true',
      premium_proxy: (options.premiumProxy ?? true).toString(),
      stealth_proxy: (options.stealthProxy ?? true).toString(),
      country_code: options.countryCode || 'us',
      wait: (options.waitTime || 8000).toString(),
      wait_for: 'body',
      wait_for_selector: 'h1, article, main, .content, #content',
      timeout: this.config.timeout.toString(),
      block_resources: 'image,media,font,stylesheet',
      return_page_source: 'true'
    });

    if (options.customJs) {
      params.append('js_scenario', encodeURIComponent(options.customJs));
    }

    return params;
  }

  private getHeaders() {
    return {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
  }

  private validateResponse(response: any) {
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in 15 seconds.');
    }

    if (response.status === 403) {
      throw new Error('Access denied by target website. Try using stealth proxy.');
    }

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    if (!response.data) {
      throw new Error('Empty response received from ScrapingBee');
    }
  }

  private handleError(error: any): Error {
    if (error.code === 'ECONNABORTED') {
      return new Error(`Request timed out after ${this.config.timeout}ms`);
    }

    if (error.response?.status === 401) {
      return new Error('Invalid ScrapingBee API key');
    }

    return error;
  }
}
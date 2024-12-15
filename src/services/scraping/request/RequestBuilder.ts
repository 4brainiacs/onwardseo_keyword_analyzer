import { env } from '../../../config/environment';
import type { ScrapingConfig } from '../types';

export class RequestBuilder {
  private config: ScrapingConfig = {
    timeout: 30000,
    maxRetries: 3,
    retryDelay: 2000,
    maxContentSize: 10 * 1024 * 1024,
    headers: {
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate'
    }
  };

  buildRequest(url: string): Request {
    const params = this.buildParams(url);
    const controller = new AbortController();
    
    setTimeout(() => controller.abort(), this.config.timeout);

    return new Request(`${env.scrapingBee.baseUrl}?${params.toString()}`, {
      method: 'GET',
      headers: this.config.headers,
      signal: controller.signal
    });
  }

  private buildParams(url: string): URLSearchParams {
    if (!env.scrapingBee.apiKey) {
      throw new Error('ScrapingBee API key is missing');
    }

    return new URLSearchParams({
      api_key: env.scrapingBee.apiKey,
      url: url,
      render_js: 'false',
      premium_proxy: 'true',
      block_ads: 'true',
      block_resources: 'true',
      country_code: 'us',
      timeout: this.config.timeout.toString()
    });
  }
}
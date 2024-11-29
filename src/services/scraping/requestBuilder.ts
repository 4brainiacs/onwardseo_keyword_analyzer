import { ScrapingConfig } from './types';
import { scrapingConfig } from './config';

export class RequestBuilder {
  constructor(private config: ScrapingConfig) {}

  buildRequest(url: string): Request {
    const params = this.buildParams(url);
    
    return new Request(`${scrapingConfig.api.baseUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        ...this.config.headers,
        'Accept': 'text/html,application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache'
      }
    });
  }

  private buildParams(url: string): URLSearchParams {
    return new URLSearchParams({
      api_key: scrapingConfig.api.key,
      url: url,
      ...Object.entries(scrapingConfig.options).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value.toString()
      }), {}),
      timeout: this.config.timeout.toString()
    });
  }
}
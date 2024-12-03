import { env } from '../../config/environment';

export const scrapingConfig = {
  api: {
    key: env.scrapingBee.apiKey || '',
    baseUrl: env.scrapingBee.baseUrl,
    timeout: 30000,
    maxRetries: env.app.isProd ? 3 : 1,
    retryDelay: 2000,
    maxContentSize: 10 * 1024 * 1024
  },
  headers: {
    'Accept': 'application/json,text/html',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate'
  },
  options: {
    render_js: false,
    premium_proxy: true,
    block_ads: true,
    block_resources: true,
    wait_browser: false,
    stealth_proxy: true,
    country_code: 'us'
  }
};
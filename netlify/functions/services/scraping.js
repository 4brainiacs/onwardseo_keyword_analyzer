import fetch from 'node-fetch';

class ScrapingService {
  constructor() {
    this.apiKey = process.env.SCRAPINGBEE_API_KEY;
    if (!this.apiKey) {
      throw new Error('SCRAPINGBEE_API_KEY environment variable is required');
    }
    this.baseUrl = 'https://app.scrapingbee.com/api/v1';
  }

  async scrapeWebpage(url) {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      url: url,
      render_js: 'false',
      premium_proxy: 'true',
      block_ads: 'true',
      block_resources: 'true',
      wait_browser: 'false',
      timeout: '30000'
    });

    try {
      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate'
        }
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`ScrapingBee API error: ${error}`);
      }

      const html = await response.text();
      
      if (!html || typeof html !== 'string') {
        throw new Error('Empty response received from ScrapingBee');
      }

      // Basic HTML validation
      if (!html.trim().toLowerCase().includes('<!doctype html') && 
          !html.trim().toLowerCase().includes('<html')) {
        throw new Error('Invalid HTML received from ScrapingBee');
      }

      return html;
    } catch (error) {
      console.error('ScrapingBee fetch error:', error);
      throw new Error(`Failed to fetch webpage: ${error.message}`);
    }
  }
}

export const scrapingService = new ScrapingService();
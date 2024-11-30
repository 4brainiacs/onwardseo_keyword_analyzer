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
      timeout: '30000',
      country_code: 'us'
    });

    try {
      console.log('Scraping URL:', url);
      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate'
        },
        timeout: 30000
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('ScrapingBee API error:', error);
        throw new Error(`ScrapingBee API error: ${error}`);
      }

      const html = await response.text();
      
      if (!html || typeof html !== 'string') {
        console.error('Empty response received from ScrapingBee');
        throw new Error('Empty response received from ScrapingBee');
      }

      console.log('Successfully scraped webpage');
      return html;
    } catch (error) {
      console.error('ScrapingBee fetch error:', error);
      throw new Error(`Failed to fetch webpage: ${error.message}`);
    }
  }
}

export const scrapingService = new ScrapingService();
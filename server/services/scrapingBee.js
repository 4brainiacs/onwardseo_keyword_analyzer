import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import AbortController from 'abort-controller';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

export class ScrapingBeeService {
  constructor() {
    this.apiKey = process.env.SCRAPINGBEE_API_KEY;
    if (!this.apiKey) {
      throw new Error('SCRAPINGBEE_API_KEY environment variable is required');
    }
    this.baseUrl = 'https://app.scrapingbee.com/api/v1';
  }

  async scrape(url) {
    const params = new URLSearchParams({
      api_key: this.apiKey,
      url: url,
      render_js: 'false',
      premium_proxy: 'false',
      block_ads: 'true',
      block_resources: 'true',
      wait_browser: 'false',
      timeout: '30000'
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'text/html,application/xhtml+xml'
        },
        agent: process.env.https_proxy ? new HttpsProxyAgent(process.env.https_proxy) : null
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`ScrapingBee API error: ${error}`);
      }

      const html = await response.text();
      
      if (!html || typeof html !== 'string') {
        throw new Error('Empty response received from ScrapingBee');
      }

      return html;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}
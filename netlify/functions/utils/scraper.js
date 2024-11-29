import { decode } from 'html-entities';

const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;
const SCRAPINGBEE_URL = 'https://app.scrapingbee.com/api/v1';

if (!SCRAPINGBEE_API_KEY) {
  throw new Error('SCRAPINGBEE_API_KEY environment variable is required');
}

export async function fetchWebpage(url) {
  const params = new URLSearchParams({
    api_key: SCRAPINGBEE_API_KEY,
    url: url,
    render_js: 'false',
    premium_proxy: 'false',
    block_ads: 'true',
    block_resources: 'true',
    wait_browser: 'false',
    timeout: '30000'
  });

  try {
    const response = await fetch(`${SCRAPINGBEE_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml'
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

    return decode(html);
  } catch (error) {
    console.error('ScrapingBee fetch error:', error);
    throw new Error(`Failed to fetch webpage: ${error.message}`);
  }
}
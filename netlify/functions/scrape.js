import fetch from 'node-fetch';

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { url } = JSON.parse(event.body || '{}');
    console.log('Processing URL:', url);

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    const apiKey = process.env.SCRAPINGBEE_API_KEY;
    if (!apiKey) {
      console.error('SCRAPINGBEE_API_KEY is not configured');
      throw new Error('SCRAPINGBEE_API_KEY is not configured');
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      url: url,
      render_js: 'false',
      premium_proxy: 'true',
      block_ads: 'true',
      block_resources: 'true',
      wait_browser: 'false',
      timeout: '30000'
    });

    console.log('Fetching from ScrapingBee...');
    const response = await fetch(`https://app.scrapingbee.com/api/v1?${params}`, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    console.log('ScrapingBee status:', response.status);
    const html = await response.text();
    console.log('ScrapingBee response length:', html.length);

    if (!response.ok) {
      throw new Error(`ScrapingBee API error: ${response.status}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: { html }
      })
    };
  } catch (error) {
    console.error('Scraping error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to scrape webpage',
        details: error.message
      })
    };
  }
}
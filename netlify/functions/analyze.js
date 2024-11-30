const cheerio = require('cheerio');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event) {
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

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    const apiKey = process.env.SCRAPINGBEE_API_KEY;
    if (!apiKey) {
      throw new Error('SCRAPINGBEE_API_KEY is not configured');
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      url: url,
      render_js: 'false',
      premium_proxy: 'true',
      block_ads: 'true',
      block_resources: 'true'
    });

    const response = await fetch(`https://app.scrapingbee.com/api/v1?${params}`);
    const html = await response.text();

    if (!response.ok) {
      throw new Error(`ScrapingBee API error: ${response.status}`);
    }

    const $ = cheerio.load(html);
    
    // Remove unwanted elements
    $('script, style, noscript, iframe, svg').remove();

    const title = $('title').text().trim();
    const h1s = $('h1').map((_, el) => $(el).text().trim()).get();
    const h2s = $('h2').map((_, el) => $(el).text().trim()).get();
    const h3s = $('h3').map((_, el) => $(el).text().trim()).get();
    const h4s = $('h4').map((_, el) => $(el).text().trim()).get();

    const textContent = $('body').text().trim();
    const words = textContent.toLowerCase().split(/\s+/).filter(Boolean);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          title,
          headings: { h1: h1s, h2: h2s, h3: h3s, h4: h4s },
          totalWords: words.length,
          scrapedContent: textContent
        }
      })
    };
  } catch (error) {
    console.error('Analysis error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Analysis failed',
        details: error.message
      })
    };
  }
};
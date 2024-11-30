import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { validateUrl } from './utils/validators.js';
import { analyzeContent } from './services/analyzer/index.js';
import { logger } from './services/utils/logger.js';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers 
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed'
      })
    };
  }

  try {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid request body'
        })
      };
    }

    const { url } = body;
    logger.info('Processing URL:', url);

    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'URL is required'
        })
      };
    }

    const urlValidation = validateUrl(url);
    if (!urlValidation.isValid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: urlValidation.error
        })
      };
    }

    const apiKey = process.env.SCRAPINGBEE_API_KEY;
    if (!apiKey) {
      logger.error('Missing API key');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Service configuration error'
        })
      };
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

    logger.info('Fetching from ScrapingBee');
    const response = await fetch(`https://app.scrapingbee.com/api/v1?${params}`, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('ScrapingBee API error:', { 
        status: response.status, 
        error: errorText 
      });
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to fetch webpage',
          details: `API returned status ${response.status}`
        })
      };
    }

    const html = await response.text();
    if (!html || !html.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Empty response from webpage'
        })
      };
    }

    logger.info('Successfully scraped webpage');
    const result = analyzeContent(html);
    logger.info('Analysis completed');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result
      })
    };
  } catch (error) {
    logger.error('Analysis error:', error);
    
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
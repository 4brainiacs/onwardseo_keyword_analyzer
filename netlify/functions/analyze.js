import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { analyzeContent } from './services/analyzer/index.js';
import { logger } from './services/utils/logger.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers: corsHeaders,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed'
      })
    };
  }

  try {
    const { url } = JSON.parse(event.body || '{}');
    logger.info('Analyzing URL:', url);

    if (!url) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'URL is required'
        })
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
      block_resources: 'true',
      wait_browser: 'false',
      timeout: '30000'
    });

    const response = await fetch(`https://app.scrapingbee.com/api/v1?${params}`, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    if (!response.ok) {
      throw new Error(`ScrapingBee API error: ${response.status}`);
    }

    const html = await response.text();
    if (!html) {
      throw new Error('Empty response from ScrapingBee');
    }

    const result = analyzeContent(html);
    logger.info('Analysis complete');

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: result
      })
    };
  } catch (error) {
    logger.error('Analysis error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to analyze webpage',
        details: error.message
      })
    };
  }
};
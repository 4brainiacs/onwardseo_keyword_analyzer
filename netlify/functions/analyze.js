import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { analyzeContent } from './services/analyzer/index.js';
import { logger } from './services/utils/logger.js';

export const handler = async (event) => {
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
    logger.info('Processing URL:', url);

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

    logger.info('Fetching webpage content');
    const response = await fetch(`https://app.scrapingbee.com/api/v1?${params}`);
    
    if (!response.ok) {
      throw new Error(`ScrapingBee API error: ${response.status}`);
    }

    const html = await response.text();
    const result = analyzeContent(html);

    logger.info('Analysis complete');
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
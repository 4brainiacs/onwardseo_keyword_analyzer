import { validateUrl } from './utils/validators.js';
import { fetchWebpage } from './utils/scraper.js';
import { analyzeContent } from './utils/analyzer.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders
    };
  }

  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Method not allowed');
  }

  try {
    const { url } = JSON.parse(event.body || '{}');

    if (!url) {
      return errorResponse(400, 'URL is required');
    }

    const urlValidation = validateUrl(url);
    if (!urlValidation.isValid) {
      return errorResponse(400, urlValidation.error);
    }

    // Fetch webpage using ScrapingBee
    const html = await fetchWebpage(url);
    
    if (!html) {
      return errorResponse(400, 'No content received from webpage');
    }

    // Analyze the content
    const result = await analyzeContent(html);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: result
      })
    };
  } catch (error) {
    console.error('Analysis error:', error);

    if (error.message.includes('ScrapingBee API error')) {
      return errorResponse(500, 'Scraping service error', error.message);
    }

    if (error.message.includes('timeout')) {
      return errorResponse(408, 'Request timeout', 'The website took too long to respond');
    }

    return errorResponse(
      500,
      'Analysis failed',
      error.message || 'An unexpected error occurred'
    );
  }
}

function errorResponse(status, error, details = null) {
  return {
    statusCode: status,
    headers: corsHeaders,
    body: JSON.stringify({
      success: false,
      error,
      ...(details && { details })
    })
  };
}
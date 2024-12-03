import { analyzeContent } from './services/analyzer/index.js';
import { logger } from './services/utils/logger.js';
import { validateUrl } from './utils/validators.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Request-ID',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers: CORS_HEADERS,
      body: ''
    };
  }

  // Validate HTTP method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed',
        details: 'Only POST requests are allowed'
      })
    };
  }

  try {
    // Parse and validate request body
    let url;
    try {
      const body = JSON.parse(event.body || '{}');
      url = body.url;
    } catch (error) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: false,
          error: 'Invalid request body',
          details: 'Request body must be valid JSON'
        })
      };
    }

    // Validate URL
    const urlValidation = validateUrl(url);
    if (!urlValidation.isValid) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: false,
          error: 'Invalid URL',
          details: urlValidation.error
        })
      };
    }

    // Get request ID from headers
    const requestId = event.headers['x-request-id'] || crypto.randomUUID();

    logger.info('Starting analysis:', { url, requestId });
    const result = await analyzeContent(url);
    logger.info('Analysis complete', { requestId });

    return {
      statusCode: 200,
      headers: {
        ...CORS_HEADERS,
        'X-Request-ID': requestId
      },
      body: JSON.stringify({
        success: true,
        data: result,
        requestId
      })
    };
  } catch (error) {
    const requestId = event.headers['x-request-id'];
    logger.error('Analysis error:', { error, requestId });

    return {
      statusCode: 500,
      headers: {
        ...CORS_HEADERS,
        'X-Request-ID': requestId
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to analyze webpage',
        details: error.message || 'An unexpected error occurred',
        retryable: true,
        retryAfter: 5000,
        requestId
      })
    };
  }
};
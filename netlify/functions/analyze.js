import { analyzeContent } from './services/analyzer';
import { validateUrl } from './utils/validators';
import { logger } from './utils/logger';

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Request-ID',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers,
      body: ''
    };
  }

  try {
    // Validate HTTP method
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Method not allowed',
          details: 'Only POST requests are allowed'
        })
      };
    }

    // Parse and validate request body
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid request body',
          details: 'Request body must be valid JSON'
        })
      };
    }

    // Validate URL parameter
    const { url } = body;
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

    // Validate URL format
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

    // Perform analysis
    logger.info('Starting analysis:', { url });
    const result = await analyzeContent(url);
    logger.info('Analysis completed successfully');

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

    const statusCode = error.status || 500;
    const isRetryable = statusCode >= 500;

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Analysis failed',
        details: error.details || 'An unexpected error occurred',
        retryable: isRetryable,
        retryAfter: isRetryable ? 5000 : undefined
      })
    };
  }
};
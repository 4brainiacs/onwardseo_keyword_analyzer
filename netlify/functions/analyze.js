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

  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers
    };
  }

  try {
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

    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (error) {
      logger.error('Request body parse error:', error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid request format',
          details: 'Request body must be valid JSON'
        })
      };
    }

    const { url } = body;
    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing URL',
          details: 'URL parameter is required'
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
          error: 'Invalid URL',
          details: urlValidation.error
        })
      };
    }

    logger.info('Starting analysis:', { url });
    const result = await analyzeContent(url);

    if (!result) {
      throw new Error('Analysis produced no results');
    }

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
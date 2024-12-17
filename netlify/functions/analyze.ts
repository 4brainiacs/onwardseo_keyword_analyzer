import { Handler } from '@netlify/functions';
import { analyzeContent } from '../../src/services/analyzer';
import { validateUrl } from '../../src/utils/validation/urlValidator';

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        ...headers,
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
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
          details: 'Only POST requests are supported'
        })
      };
    }

    const { url } = JSON.parse(event.body || '{}');
    
    const validation = validateUrl(url);
    if (!validation.isValid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid URL',
          details: validation.error
        })
      };
    }

    const result = await analyzeContent(url);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result
      })
    };

  } catch (error) {
    console.error('Analysis error:', error);

    return {
      statusCode: error.status || 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Analysis failed',
        details: error.details || 'An unexpected error occurred',
        retryable: error.retryable || error.status >= 500,
        retryAfter: error.retryAfter || 5000
      })
    };
  }
};
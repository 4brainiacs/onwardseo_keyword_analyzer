import { Handler } from '@netlify/functions';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { analyzeContent } from '../../src/services/analyzer';
import { validateUrl } from '../../src/utils/validation/urlValidator';

export const handler: Handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
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
          details: 'Only POST requests are supported'
        })
      };
    }

    const { url } = JSON.parse(event.body || '{}');
    
    // Validate URL
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

    // Fetch webpage content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      },
      timeout: 30000,
      maxContentLength: 10 * 1024 * 1024 // 10MB
    });

    const $ = cheerio.load(response.data);
    const result = analyzeContent($);

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

    // Handle specific error types
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return {
          statusCode: 408,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Request timeout',
            details: 'The website took too long to respond',
            retryable: true
          })
        };
      }

      if (!error.response) {
        return {
          statusCode: 503,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Network error',
            details: 'Could not connect to the website',
            retryable: true
          })
        };
      }

      return {
        statusCode: error.response.status,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to fetch webpage',
          details: error.message,
          retryable: error.response.status >= 500
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        retryable: true
      })
    };
  }
};
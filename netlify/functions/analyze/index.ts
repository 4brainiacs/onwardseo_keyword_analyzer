import { Handler } from '@netlify/functions';
import { AnalyzerService } from './services/analyzer';
import { RequestHandler } from './handlers/requestHandler';
import { ResponseHandler } from './handlers/responseHandler';
import { ErrorMiddleware } from './middleware/errorMiddleware';
import { logger } from '../../../src/utils/logger';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler: Handler = async (event) => {
  // Add CORS headers to all responses
  const headers = CORS_HEADERS;

  try {
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers };
    }

    // Validate HTTP method
    if (event.httpMethod !== 'POST') {
      return ResponseHandler.methodNotAllowed(headers);
    }

    // Parse and validate request body
    if (!event.body) {
      return ResponseHandler.badRequest('Missing request body', 'Request body is required', headers);
    }

    let url: string;
    try {
      const body = JSON.parse(event.body);
      url = body.url;
    } catch (error) {
      return ResponseHandler.badRequest('Invalid JSON', 'Request body must be valid JSON', headers);
    }

    if (!url) {
      return ResponseHandler.badRequest('Missing URL', 'URL is required in request body', headers);
    }

    // Analyze content
    logger.info('Processing request:', { url });
    const result = await AnalyzerService.analyze(url);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result
      })
    };
  } catch (error) {
    logger.error('Analysis failed:', error);
    
    const errorResponse = ErrorMiddleware.handleError(error);
    return {
      ...errorResponse,
      headers
    };
  }
};
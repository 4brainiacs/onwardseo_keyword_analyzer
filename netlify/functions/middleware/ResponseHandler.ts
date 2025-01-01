import type { HandlerResponse } from '@netlify/functions';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export class ResponseHandler {
  static success<T>(data: T, statusCode: number = 200): HandlerResponse {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      },
      body: JSON.stringify({
        success: true,
        data,
        timestamp: new Date().toISOString()
      })
    };
  }

  static error(
    message: string,
    statusCode: number = 500,
    details?: string,
    retryable: boolean = false
  ): HandlerResponse {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      },
      body: JSON.stringify({
        success: false,
        error: message,
        details,
        retryable: retryable || statusCode >= 500,
        retryAfter: 5000,
        timestamp: new Date().toISOString()
      })
    };
  }
}
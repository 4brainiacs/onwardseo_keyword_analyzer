import { AnalysisError } from '../../errors';
import { CONTENT_TYPES, ERROR_MESSAGES } from '../constants';
import type { ApiResponse } from '../types';

export function validateContentType(response: Response): void {
  const contentType = response.headers.get('content-type');
  
  if (!contentType) {
    return; // Some APIs don't set content-type header
  }

  const normalizedType = contentType.toLowerCase();
  if (!normalizedType.includes('application/json')) {
    throw new AnalysisError(
      ERROR_MESSAGES.INVALID_JSON,
      415,
      `Expected JSON but received: ${contentType}`,
      false
    );
  }
}

export function validateStatus(response: Response): void {
  if (!response.ok) {
    const status = response.status;
    let message = ERROR_MESSAGES.SERVER_ERROR;
    let retryable = status >= 500;

    switch (status) {
      case 401:
        message = ERROR_MESSAGES.UNAUTHORIZED;
        retryable = false;
        break;
      case 404:
        message = ERROR_MESSAGES.NOT_FOUND;
        retryable = false;
        break;
      case 400:
        message = ERROR_MESSAGES.BAD_REQUEST;
        retryable = false;
        break;
      case 429:
        message = ERROR_MESSAGES.RATE_LIMIT;
        retryable = true;
        break;
    }

    throw new AnalysisError(message, status, undefined, retryable);
  }
}

export async function validateJsonResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    const text = await response.text();
    if (!text) {
      throw new Error('Empty response');
    }

    // Handle HTML responses
    if (text.trim().toLowerCase().startsWith('<!doctype') || 
        text.trim().toLowerCase().startsWith('<html')) {
      throw new Error('Received HTML instead of JSON');
    }
    
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }
    
    return data as ApiResponse<T>;
  } catch (error) {
    throw new AnalysisError(
      ERROR_MESSAGES.INVALID_JSON,
      500,
      error instanceof Error ? error.message : 'Failed to parse response as JSON',
      true
    );
  }
}
import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from './constants';
import type { ApiResponse } from './types';

export async function handleApiResponse<T>(response: Response): Promise<T> {
  try {
    // Validate content type
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new AnalysisError(
        ERROR_MESSAGES.INVALID_JSON,
        HTTP_STATUS.SERVER_ERROR,
        `Expected JSON but received: ${contentType}`,
        true
      );
    }

    // Get response text
    const text = await response.text();
    
    if (!text.trim()) {
      throw new AnalysisError(
        ERROR_MESSAGES.INVALID_RESPONSE,
        HTTP_STATUS.SERVER_ERROR,
        'Server returned an empty response',
        true
      );
    }

    // Check for HTML content
    if (text.trim().toLowerCase().startsWith('<!doctype') || 
        text.trim().toLowerCase().startsWith('<html')) {
      throw new AnalysisError(
        ERROR_MESSAGES.HTML_RESPONSE,
        HTTP_STATUS.SERVER_ERROR,
        'Server returned HTML instead of JSON',
        true
      );
    }

    // Parse JSON
    let data: ApiResponse<T>;
    try {
      data = JSON.parse(text);
    } catch (error) {
      logger.error('JSON parse error:', { error, responseText: text.slice(0, 200) });
      throw new AnalysisError(
        ERROR_MESSAGES.INVALID_JSON,
        HTTP_STATUS.SERVER_ERROR,
        'Server returned invalid JSON data',
        true
      );
    }

    // Check response status
    if (!response.ok || !data.success) {
      throw new AnalysisError(
        data.error || ERROR_MESSAGES.SERVER_ERROR,
        response.status,
        data.details || `Server returned status ${response.status}`,
        response.status >= 500,
        data.retryAfter
      );
    }

    return data.data;
  } catch (error) {
    if (error instanceof AnalysisError) {
      throw error;
    }

    logger.error('Response handling error:', error);
    throw new AnalysisError(
      ERROR_MESSAGES.SERVER_ERROR,
      HTTP_STATUS.SERVER_ERROR,
      error instanceof Error ? error.message : 'An unexpected error occurred',
      true
    );
  }
}
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { ERROR_MESSAGES } from '../constants';
import type { ApiResponse } from '../types';

export class ResponseHandler {
  async handleResponse<T>(response: Response, text: string): Promise<T> {
    try {
      // Log raw response for debugging
      logger.debug('Raw response:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        bodyPreview: text.slice(0, 200)
      });

      // Check for empty response
      if (!text || !text.trim()) {
        logger.error('Empty response received');
        throw new AnalysisError(
          'Empty response',
          500,
          'Server returned an empty response',
          true
        );
      }

      // Parse JSON response
      let data: ApiResponse<T>;
      try {
        data = JSON.parse(text);
        logger.debug('Parsed response:', data);
      } catch (error) {
        logger.error('JSON parse error:', { 
          error, 
          responseText: text.slice(0, 200),
          contentType: response.headers.get('content-type')
        });
        throw new AnalysisError(
          ERROR_MESSAGES.VALIDATION.INVALID_JSON,
          500,
          'Server returned invalid JSON data',
          true
        );
      }

      // Validate response structure
      if (!data || typeof data !== 'object') {
        logger.error('Invalid response format:', { data });
        throw new AnalysisError(
          'Invalid response format',
          500,
          'Server returned unexpected data format',
          true
        );
      }

      // Check for API error response
      if (!data.success || !data.data) {
        logger.error('API error response:', data);
        throw new AnalysisError(
          data.error || 'Request failed',
          response.status,
          data.details || 'Server returned unsuccessful response',
          data.retryable || false,
          data.retryAfter || 5000
        );
      }

      // Validate data is not empty
      if (typeof data.data === 'object' && !Object.keys(data.data).length) {
        throw new AnalysisError(
          'Empty response data',
          500,
          'Server returned empty data object',
          true
        );
      }

      return data.data;
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }

      logger.error('Response handling failed:', error);
      throw new AnalysisError(
        'Failed to process response',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}
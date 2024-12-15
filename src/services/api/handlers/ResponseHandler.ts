import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS } from '../constants';
import type { ApiResponse } from '../types';

export class ResponseHandler {
  async handleResponse<T>(response: Response): Promise<T> {
    try {
      const contentType = response.headers.get(API_CONSTANTS.HEADERS.CONTENT_TYPE);
      if (!contentType?.includes(API_CONSTANTS.CONTENT_TYPES.JSON)) {
        throw new AnalysisError({
          message: API_CONSTANTS.ERROR_MESSAGES.VALIDATION.INVALID_CONTENT,
          status: 415,
          details: `Expected JSON but received: ${contentType}`,
          retryable: false
        });
      }

      const text = await response.text();
      if (!text.trim()) {
        throw new AnalysisError({
          message: API_CONSTANTS.ERROR_MESSAGES.VALIDATION.EMPTY_RESPONSE,
          status: 500,
          details: 'Server returned empty response',
          retryable: true
        });
      }

      let data: ApiResponse<T>;
      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new AnalysisError({
          message: API_CONSTANTS.ERROR_MESSAGES.VALIDATION.INVALID_JSON,
          status: 500,
          details: 'Server returned invalid JSON data',
          retryable: true
        });
      }

      if (!data.success) {
        throw new AnalysisError({
          message: data.error,
          status: data.status || 500,
          details: data.details,
          retryable: data.retryable ?? false,
          retryAfter: data.retryAfter
        });
      }

      return data.data;
    } catch (error) {
      logger.error('Response handling failed:', error);
      throw error instanceof AnalysisError ? error : new AnalysisError({
        message: 'Failed to process response',
        status: 500,
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        retryable: true
      });
    }
  }
}
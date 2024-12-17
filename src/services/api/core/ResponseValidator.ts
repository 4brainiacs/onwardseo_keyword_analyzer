import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import type { ApiResponse } from '../types';

export class ResponseValidator {
  async validateResponse<T>(response: Response): Promise<T> {
    try {
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new AnalysisError(
          ERROR_MESSAGES.VALIDATION.INVALID_CONTENT,
          HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
          `Expected JSON but received: ${contentType}`,
          false
        );
      }

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw new AnalysisError(
          error.message || 'Request failed',
          response.status,
          error.details || `Server returned status ${response.status}`,
          response.status >= 500
        );
      }

      const text = await response.text();
      if (!text) {
        throw new AnalysisError(
          ERROR_MESSAGES.VALIDATION.EMPTY_RESPONSE,
          HTTP_STATUS.BAD_GATEWAY,
          'Server returned empty response',
          true
        );
      }

      let data: ApiResponse<T>;
      try {
        data = JSON.parse(text);
      } catch {
        throw new AnalysisError(
          ERROR_MESSAGES.VALIDATION.INVALID_JSON,
          HTTP_STATUS.BAD_GATEWAY,
          'Server returned invalid JSON data',
          true
        );
      }

      if (!data.success || !data.data) {
        throw new AnalysisError(
          ERROR_MESSAGES.VALIDATION.INVALID_RESPONSE,
          HTTP_STATUS.BAD_GATEWAY,
          'Server returned unsuccessful response',
          true
        );
      }

      return data.data;
    } catch (error) {
      logger.error('Response validation failed:', error);
      throw error instanceof AnalysisError ? error : new AnalysisError(
        'Failed to validate response',
        HTTP_STATUS.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Unknown error occurred',
        true
      );
    }
  }

  private async parseErrorResponse(response: Response): Promise<{
    message?: string;
    details?: string;
  }> {
    try {
      const data = await response.json();
      return {
        message: data.error,
        details: data.details
      };
    } catch {
      return {
        message: `HTTP ${response.status}`,
        details: response.statusText
      };
    }
  }
}
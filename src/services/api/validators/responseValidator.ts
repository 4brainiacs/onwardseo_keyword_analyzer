import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import type { ApiResponse } from '../types';

export class ResponseValidator {
  async validateResponse<T>(response: Response): Promise<T> {
    try {
      await this.validateContentType(response);
      const data = await this.parseResponse<T>(response);
      return this.validateData(data);
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

  private async validateContentType(response: Response): Promise<void> {
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.INVALID_CONTENT,
        HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
        `Expected JSON but received: ${contentType}`,
        false
      );
    }
  }

  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const text = await response.text();
    if (!text) {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.EMPTY_RESPONSE,
        HTTP_STATUS.BAD_GATEWAY,
        'Server returned empty response',
        true
      );
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.INVALID_JSON,
        HTTP_STATUS.BAD_GATEWAY,
        'Server returned invalid JSON data',
        true
      );
    }
  }

  private validateData<T>(data: ApiResponse<T>): T {
    if (!data.success || !data.data) {
      throw new AnalysisError(
        data.error || ERROR_MESSAGES.VALIDATION.INVALID_RESPONSE,
        HTTP_STATUS.BAD_GATEWAY,
        data.details || 'Server returned unsuccessful response',
        true
      );
    }

    return data.data;
  }
}
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS } from '../constants';
import type { ApiResponse } from '../types';

export class ResponseHandler {
  async handleResponse<T>(response: Response): Promise<T> {
    try {
      await this.validateContentType(response);
      const text = await response.text();
      
      if (!text.trim()) {
        throw new AnalysisError({
          message: API_CONSTANTS.VALIDATION.EMPTY_RESPONSE,
          status: 500,
          details: 'Server returned empty response',
          retryable: true
        });
      }

      const data = await this.parseJsonResponse(text);
      return this.validateApiResponse<T>(data);
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

  private async validateContentType(response: Response): Promise<void> {
    const contentType = response.headers.get(API_CONSTANTS.HEADERS.CONTENT_TYPE);
    if (!contentType?.includes(API_CONSTANTS.CONTENT_TYPES.JSON)) {
      throw new AnalysisError({
        message: API_CONSTANTS.VALIDATION.INVALID_CONTENT,
        status: 415,
        details: `Expected JSON but received: ${contentType}`,
        retryable: false
      });
    }
  }

  private async parseJsonResponse(text: string): Promise<unknown> {
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new AnalysisError({
        message: API_CONSTANTS.VALIDATION.INVALID_JSON,
        status: 500,
        details: 'Server returned invalid JSON data',
        retryable: true
      });
    }
  }

  private validateApiResponse<T>(data: unknown): T {
    if (!this.isValidApiResponse(data)) {
      throw new AnalysisError({
        message: API_CONSTANTS.VALIDATION.INVALID_RESPONSE,
        status: 500,
        details: 'Server returned unexpected data format',
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
  }

  private isValidApiResponse(data: unknown): data is ApiResponse<unknown> {
    if (!data || typeof data !== 'object') return false;
    const response = data as Partial<ApiResponse<unknown>>;
    return typeof response.success === 'boolean' && 
           (response.success ? 'data' in response : 'error' in response);
  }
}
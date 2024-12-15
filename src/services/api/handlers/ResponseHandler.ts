import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { ContentTypeValidator } from '../validators/contentTypeValidator';
import type { ApiResponse } from '../types/response';

export class ResponseHandler {
  async validateResponse(response: Response): Promise<void> {
    try {
      // Validate content type first
      ContentTypeValidator.validate(response);

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw new AnalysisError(
          error.message || 'Request failed',
          response.status,
          error.details || `Server returned status ${response.status}`,
          response.status >= 500
        );
      }
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }
      
      logger.error('Response validation failed:', error);
      throw new AnalysisError(
        'Invalid response',
        500,
        error instanceof Error ? error.message : 'Failed to validate response',
        true
      );
    }
  }

  async handleResponse<T>(response: Response): Promise<T> {
    try {
      await this.validateResponse(response);
      return await this.parseSuccessResponse<T>(response);
    } catch (error) {
      logger.error('Response handling failed:', error);
      throw error instanceof AnalysisError ? error : new AnalysisError(
        'Failed to process response',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }

  private async parseSuccessResponse<T>(response: Response): Promise<T> {
    try {
      const text = await response.text();
      
      if (!text.trim()) {
        throw new AnalysisError(
          'Empty response',
          500,
          'Server returned empty response',
          true
        );
      }

      const data = JSON.parse(text) as ApiResponse<T>;
      
      if (!data.success || !data.data) {
        throw new AnalysisError(
          data.error || 'Invalid response format',
          data.status || 500,
          data.details || 'Server returned unsuccessful response',
          data.retryable ?? false,
          data.retryAfter
        );
      }

      return data.data;
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }

      logger.error('Response parsing failed:', error);
      throw new AnalysisError(
        'Invalid JSON response',
        500,
        'Failed to parse server response',
        true
      );
    }
  }

  private async parseErrorResponse(response: Response): Promise<{ message?: string; details?: string }> {
    try {
      const text = await response.text();
      
      if (!text.trim()) {
        return {
          message: `HTTP ${response.status}`,
          details: response.statusText
        };
      }

      const data = JSON.parse(text);
      return {
        message: data.error,
        details: data.details
      };
    } catch (error) {
      logger.error('Failed to parse error response:', error);
      return {
        message: `HTTP ${response.status}`,
        details: response.statusText
      };
    }
  }
}
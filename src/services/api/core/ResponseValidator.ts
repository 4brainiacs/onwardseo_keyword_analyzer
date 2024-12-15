import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS, ERROR_MESSAGES } from '../constants';

export class ResponseValidator {
  async validateResponse(response: Response): Promise<void> {
    // First check content type
    const contentType = response.headers.get(API_CONSTANTS.HEADERS.CONTENT_TYPE);
    
    if (!contentType) {
      logger.error('Missing content type header');
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.CONTENT_TYPE,
        415,
        'Response is missing content type header',
        true
      );
    }

    if (!contentType.toLowerCase().includes(API_CONSTANTS.CONTENT_TYPES.JSON)) {
      const text = await response.text();
      logger.error('Invalid content type:', { 
        contentType,
        responsePreview: text.slice(0, 200)
      });
      
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.CONTENT_TYPE,
        415,
        `Expected JSON but received: ${contentType}`,
        false
      );
    }

    // Then check response status
    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      throw new AnalysisError(
        error.message || ERROR_MESSAGES.VALIDATION.INVALID_RESPONSE,
        response.status,
        error.details,
        response.status >= 500
      );
    }
  }

  private async parseErrorResponse(response: Response): Promise<{ message?: string; details?: string }> {
    try {
      const data = await response.json();
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

  async validateApiResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    
    try {
      const data = JSON.parse(text);

      if (!data || typeof data !== 'object') {
        throw new AnalysisError(
          ERROR_MESSAGES.VALIDATION.INVALID_RESPONSE,
          500,
          'Server returned unexpected data format',
          true
        );
      }

      if (!data.success || !data.data) {
        throw new AnalysisError(
          data.error || ERROR_MESSAGES.VALIDATION.INVALID_RESPONSE,
          data.status || 500,
          data.details || 'Server returned unsuccessful response',
          data.retryable || false,
          data.retryAfter
        );
      }

      return data.data;
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }

      logger.error('Response parsing failed:', {
        error,
        responseText: text.slice(0, 200)
      });

      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.INVALID_JSON,
        500,
        'Failed to parse server response',
        true
      );
    }
  }
}
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS, ERROR_MESSAGES } from '../constants';

export class ResponseValidator {
  validateContentType(response: Response): void {
    const contentType = response.headers.get(API_CONSTANTS.HEADERS.CONTENT_TYPE);
    
    if (!contentType?.includes(API_CONSTANTS.CONTENT_TYPES.JSON)) {
      logger.error('Invalid content type:', { contentType });
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.INVALID_CONTENT,
        415,
        `Expected JSON but received: ${contentType}`,
        false
      );
    }
  }

  async validateResponseBody<T>(response: Response): Promise<T> {
    const text = await response.text();
    
    if (!text.trim()) {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.EMPTY_RESPONSE,
        500,
        'Server returned empty response',
        true
      );
    }

    try {
      const data = JSON.parse(text);
      return this.validateApiResponse(data);
    } catch (error) {
      logger.error('JSON parse error:', { error, responseText: text.slice(0, 200) });
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.INVALID_JSON,
        500,
        'Server returned invalid JSON data',
        true
      );
    }
  }

  private validateApiResponse<T>(data: unknown): T {
    if (!data || typeof data !== 'object') {
      throw new AnalysisError(
        'Invalid response format',
        500,
        'Server returned unexpected data format',
        true
      );
    }

    const response = data as any;
    if (!response.success || !response.data) {
      throw new AnalysisError(
        response.error || 'Request failed',
        response.status || 500,
        response.details || 'Server returned unsuccessful response',
        response.retryable ?? false,
        response.retryAfter ?? API_CONSTANTS.TIMEOUTS.RETRY
      );
    }

    return response.data;
  }
}
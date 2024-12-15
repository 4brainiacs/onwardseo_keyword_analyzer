import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS } from '../constants';

export abstract class BaseValidator {
  protected validateContentType(response: Response, expectedType: string): void {
    const contentType = response.headers.get(API_CONSTANTS.HEADERS.CONTENT_TYPE);
    
    if (!contentType) {
      logger.error('Missing content type header');
      throw new AnalysisError(
        'Missing content type',
        415,
        'Response is missing content type header',
        true
      );
    }

    if (!contentType.toLowerCase().includes(expectedType)) {
      logger.error('Invalid content type:', { contentType, expected: expectedType });
      throw new AnalysisError(
        'Invalid content type',
        415,
        `Expected ${expectedType} but received: ${contentType}`,
        false
      );
    }
  }

  protected async validateResponseStatus(response: Response): Promise<void> {
    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      throw new AnalysisError(
        error.message || 'Request failed',
        response.status,
        error.details || `Server returned status ${response.status}`,
        response.status >= 500
      );
    }
  }

  protected async parseErrorResponse(response: Response): Promise<{ message?: string; details?: string }> {
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
}
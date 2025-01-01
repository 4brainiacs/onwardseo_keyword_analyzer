import { AnalysisError } from '../../errors/AnalysisError';
import { logger } from '../../../utils/logger';
import { ERROR_MESSAGES } from '../constants';

export class ContentTypeValidator {
  static validate(response: Response): void {
    const contentType = response.headers.get('content-type')?.toLowerCase();

    // Log content type for debugging
    logger.debug('Response content type:', { contentType });

    if (!contentType) {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.MISSING_CONTENT_TYPE,
        415,
        'Response is missing content type header',
        false
      );
    }

    // Check for HTML content type
    if (contentType.includes('text/html')) {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.HTML_RESPONSE,
        502,
        'Server returned HTML instead of JSON',
        true
      );
    }

    // Check for plain text content type
    if (contentType.includes('text/plain')) {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.INVALID_CONTENT,
        415,
        'Server returned plain text instead of JSON',
        false
      );
    }

    // Verify JSON content type
    if (!contentType.includes('application/json')) {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.INVALID_CONTENT,
        415,
        `Expected JSON but received: ${contentType}`,
        false
      );
    }
  }
}
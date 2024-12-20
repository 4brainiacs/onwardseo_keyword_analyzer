import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class ContentTypeValidator {
  static validate(response: Response): void {
    const contentType = response.headers.get('content-type');
    
    if (!contentType) {
      logger.error('Missing content type header');
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.MISSING_CONTENT_TYPE,
        HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
        'Response is missing content type header',
        true
      );
    }

    if (!contentType.toLowerCase().includes('application/json')) {
      logger.error('Invalid content type:', { contentType });
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.INVALID_CONTENT,
        HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
        `Expected JSON but received: ${contentType}`,
        false
      );
    }
  }
}
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export class ContentTypeValidator {
  static validate(response: Response): void {
    const contentType = response.headers.get('content-type');
    
    if (!contentType) {
      logger.error('Missing content type header');
      throw new AnalysisError(
        'Missing content type',
        415,
        'Response is missing content type header',
        true
      );
    }

    if (!contentType.toLowerCase().includes('application/json')) {
      logger.error('Invalid content type:', { contentType });
      throw new AnalysisError(
        'Invalid content type',
        415,
        `Expected JSON but received: ${contentType}`,
        false
      );
    }
  }
}
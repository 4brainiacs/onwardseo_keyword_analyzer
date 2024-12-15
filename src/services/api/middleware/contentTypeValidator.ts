import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export class ContentTypeValidator {
  static async validate(response: Response): Promise<void> {
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      logger.error('Invalid content type received:', {
        contentType,
        status: response.status,
        responsePreview: text.slice(0, 200)
      });

      throw new AnalysisError(
        'Invalid content type',
        415,
        `Expected JSON but received: ${contentType}`,
        false
      );
    }
  }
}
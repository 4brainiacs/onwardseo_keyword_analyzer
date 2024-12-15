import { BaseValidator } from '../core/BaseValidator';
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export class ContentValidator extends BaseValidator {
  validateContent(content: string | null): void {
    if (!content || !content.trim()) {
      throw new AnalysisError(
        'Empty content',
        400,
        'No content received',
        false
      );
    }

    const cleanContent = content.toLowerCase().trim();

    // Check for HTML error pages
    if (this.isErrorPage(cleanContent)) {
      throw new AnalysisError(
        'Error page detected',
        400,
        'Target URL returned an error page',
        false
      );
    }

    logger.debug('Content validation passed', {
      length: content.length,
      preview: content.slice(0, 200)
    });
  }

  private isErrorPage(content: string): boolean {
    const errorPatterns = [
      '404 not found',
      '403 forbidden',
      '500 internal server error',
      'access denied',
      'service unavailable'
    ];

    return errorPatterns.some(pattern => content.includes(pattern));
  }
}
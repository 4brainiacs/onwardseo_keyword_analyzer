import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { ValidationResult } from './types';

export class ContentValidator {
  validateContent(content: string | null): ValidationResult {
    try {
      if (!content || !content.trim()) {
        return {
          isValid: false,
          error: 'Empty content',
          details: 'No content received'
        };
      }

      const cleanContent = content.toLowerCase().trim();

      // Check for error pages
      if (this.isErrorPage(cleanContent)) {
        return {
          isValid: false,
          error: 'Error page detected',
          details: 'Target URL returned an error page'
        };
      }

      logger.debug('Content validation passed', {
        length: content.length,
        preview: content.slice(0, 200)
      });

      return { isValid: true };
    } catch (error) {
      logger.error('Content validation failed:', { error });
      return {
        isValid: false,
        error: 'Validation error',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
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
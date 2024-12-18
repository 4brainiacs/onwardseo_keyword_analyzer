import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class ContentValidator {
  validateContent(html: string): void {
    if (!html || !html.trim()) {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.EMPTY_RESPONSE,
        HTTP_STATUS.BAD_REQUEST,
        'No content received from webpage',
        false
      );
    }

    const cleanHtml = html.toLowerCase().trim();
    
    // Validate HTML structure
    if (!cleanHtml.includes('<!doctype html') && !cleanHtml.includes('<html')) {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.INVALID_CONTENT,
        HTTP_STATUS.BAD_REQUEST,
        'Content is not valid HTML',
        false
      );
    }

    // Check for error pages
    if (this.isErrorPage(cleanHtml)) {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.ERROR_PAGE,
        HTTP_STATUS.BAD_REQUEST,
        'URL returns an error page',
        false
      );
    }

    logger.debug('Content validation passed', {
      length: html.length,
      hasDoctype: cleanHtml.includes('<!doctype html'),
      hasHtmlTag: cleanHtml.includes('<html')
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
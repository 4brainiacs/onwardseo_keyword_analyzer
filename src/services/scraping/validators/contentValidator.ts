import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export class ContentValidator {
  validateContent(html: string): void {
    if (!html || !html.trim()) {
      throw new AnalysisError(
        'Empty content',
        400,
        'No content received from webpage',
        false
      );
    }

    const cleanHtml = html.toLowerCase().trim();
    
    // Validate HTML structure
    if (!cleanHtml.includes('<!doctype html') && !cleanHtml.includes('<html')) {
      throw new AnalysisError(
        'Invalid HTML',
        400,
        'Content is not valid HTML',
        false
      );
    }

    // Check for error pages
    if (
      cleanHtml.includes('404 not found') ||
      cleanHtml.includes('403 forbidden') ||
      cleanHtml.includes('500 internal server error')
    ) {
      throw new AnalysisError(
        'Error page detected',
        400,
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
}
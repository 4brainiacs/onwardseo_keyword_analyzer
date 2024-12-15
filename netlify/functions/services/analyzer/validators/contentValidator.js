import { AnalysisError } from '../../errors/AnalysisError';
import { logger } from '../../utils/logger';

export function validateContent(html) {
  if (!html || typeof html !== 'string') {
    throw new AnalysisError(
      'Invalid content',
      500,
      'No HTML content received',
      true
    );
  }

  const trimmedHtml = html.trim();
  if (!trimmedHtml) {
    throw new AnalysisError(
      'Empty content',
      500,
      'Server returned empty content',
      true
    );
  }

  const cleanHtml = trimmedHtml.toLowerCase();
  
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
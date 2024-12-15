import { AnalysisError } from '../../errors/AnalysisError';
import { logger } from '../../utils/logger';

export function validateResponse(response) {
  // Check status
  if (!response.ok && response.status !== 200) {
    throw new AnalysisError(
      'HTTP error',
      response.status,
      `Server returned status ${response.status}: ${response.statusText}`,
      response.status >= 500
    );
  }

  // Validate content type
  const contentType = response.headers['content-type']?.toLowerCase();
  if (!contentType) {
    throw new AnalysisError(
      'Missing content type',
      500,
      'Server response is missing content type header',
      true
    );
  }

  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
    throw new AnalysisError(
      'Invalid content type',
      415,
      `Expected HTML but received: ${contentType}`,
      false
    );
  }

  logger.debug('Response validation passed', {
    status: response.status,
    contentType
  });
}
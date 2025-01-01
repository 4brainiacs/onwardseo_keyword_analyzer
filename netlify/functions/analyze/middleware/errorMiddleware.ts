import { AnalysisError } from '../../../../src/services/errors';
import { logger } from '../../../../src/utils/logger';

export class ErrorMiddleware {
  static handleError(error: unknown) {
    logger.error('Function error:', error);

    if (error instanceof AnalysisError) {
      return {
        statusCode: error.status,
        body: JSON.stringify({
          success: false,
          error: error.message,
          details: error.details,
          retryable: error.retryable,
          retryAfter: error.retryAfter
        })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        retryable: true,
        retryAfter: 5000
      })
    };
  }
}
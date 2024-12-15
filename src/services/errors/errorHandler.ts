import { BaseError, AnalysisError, NetworkError } from './index';
import { logger } from '../../utils/logger';

export class ErrorHandler {
  static handle(error: unknown, context?: Record<string, unknown>): BaseError {
    logger.error('Error occurred:', { error, context });

    if (error instanceof BaseError) {
      return error;
    }

    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        return new NetworkError(
          'Network error',
          503,
          'Unable to connect to the server. Please check your connection.'
        );
      }

      if (error.message.includes('aborted')) {
        return new NetworkError(
          'Request timeout',
          408,
          'The request took too long to complete. Please try again.'
        );
      }
    }

    if (error instanceof Response) {
      return new AnalysisError(
        'Request failed',
        error.status,
        `Server returned status ${error.status}`,
        error.status >= 500
      );
    }

    return new AnalysisError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500,
      undefined,
      true,
      5000,
      undefined,
      context
    );
  }

  static isRetryable(error: unknown): boolean {
    if (error instanceof BaseError) {
      return error.retryable;
    }
    return false;
  }

  static getRetryDelay(error: unknown): number {
    if (error instanceof BaseError) {
      return error.retryAfter;
    }
    return 5000;
  }
}
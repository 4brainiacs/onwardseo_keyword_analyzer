import { BaseError, AnalysisError, NetworkError, ServerError } from './types';
import { logger } from '../../utils/logger';
import { ErrorReporter } from './errorReporter';

export class ErrorHandler {
  static handle(error: unknown, context?: Record<string, unknown>): BaseError {
    // Log the error
    ErrorReporter.captureException(error, { additionalInfo: context });

    // Return appropriate error type
    if (error instanceof BaseError) {
      return error;
    }

    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        return new NetworkError(
          'Network error',
          'Unable to connect to the server. Please check your connection.'
        );
      }

      if (error.message.includes('aborted')) {
        return new NetworkError(
          'Request timeout',
          'The request took too long to complete. Please try again.'
        );
      }
    }

    if (error instanceof Response) {
      return new ServerError(
        'Request failed',
        `Server returned status ${error.status}`
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

    if (error instanceof TypeError) {
      return error.message.includes('Failed to fetch') ||
             error.message.includes('aborted');
    }

    return false;
  }

  static getRetryDelay(error: unknown): number {
    if (error instanceof BaseError) {
      return error.retryAfter || 5000;
    }
    return 5000;
  }
}
import { BaseError } from '../core/BaseError';
import { AnalysisError } from '../domain/AnalysisError';
import { NetworkError } from '../domain/NetworkError';
import { logger } from '../../../utils/logger';

export class ErrorHandler {
  static handle(error: unknown, context?: Record<string, unknown>): never {
    logger.error('Error occurred:', { error, context });

    if (error instanceof BaseError) {
      throw error;
    }

    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        throw new NetworkError(
          'Network error',
          503,
          'Unable to connect to the server. Please check your connection.'
        );
      }

      if (error.message.includes('aborted')) {
        throw new NetworkError(
          'Request timeout',
          408,
          'The request took too long to complete'
        );
      }
    }

    throw AnalysisError.fromError(error, context);
  }

  static isRetryable(error: unknown): boolean {
    return error instanceof BaseError && error.retryable;
  }

  static getRetryDelay(error: unknown): number {
    return error instanceof BaseError ? error.retryAfter : 5000;
  }

  static getErrorCode(error: unknown): string {
    return error instanceof BaseError ? error.code : 'UNKNOWN_ERROR';
  }

  static getErrorDetails(error: unknown): string | undefined {
    return error instanceof BaseError ? error.details : undefined;
  }
}
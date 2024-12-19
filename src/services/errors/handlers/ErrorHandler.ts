import { BaseError } from '../core/BaseError';
import { ApiError } from '../domain/ApiError';
import { logger } from '../../../utils/logger';

export class ErrorHandler {
  static handle(error: unknown, context?: Record<string, unknown>): never {
    logger.error('Error occurred:', { error, context });

    if (error instanceof BaseError) {
      throw error;
    }

    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        throw ApiError.networkError('Unable to connect to the server');
      }

      if (error.message.includes('aborted')) {
        throw ApiError.timeout('The request took too long to complete');
      }
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      { status: 500, retryable: true }
    );
  }

  static isRetryable(error: unknown): boolean {
    return error instanceof BaseError && error.retryable;
  }

  static getRetryDelay(error: unknown): number {
    return error instanceof BaseError ? error.retryAfter : 5000;
  }
}
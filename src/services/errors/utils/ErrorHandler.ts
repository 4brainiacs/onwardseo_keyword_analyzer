import { BaseError, ErrorMetadata } from '../core/BaseError';
import { ApiError } from '../types/ApiError';
import { AnalysisError } from '../types/AnalysisError';
import { ValidationError } from '../types/ValidationError';
import { logger } from '../../../utils/logger';

export class ErrorHandler {
  static handle(error: unknown, context?: Record<string, unknown>): never {
    // Already handled errors
    if (error instanceof BaseError) {
      throw error;
    }

    // Network errors
    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        throw ApiError.networkError(
          'Network error',
          'Unable to connect to the server'
        );
      }

      if (error.message.includes('aborted')) {
        throw ApiError.timeout(
          'Request timeout',
          'The request took too long to complete'
        );
      }
    }

    // Response errors
    if (error instanceof Response) {
      throw new ApiError('Request failed', {
        status: error.status,
        details: `Server returned status ${error.status}`,
        retryable: error.status >= 500
      });
    }

    // Log unhandled errors
    logger.error('Unhandled error:', {
      error,
      context,
      stack: error instanceof Error ? error.stack : undefined
    });

    // Default error
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      {
        status: 500,
        details: 'An unexpected error occurred',
        retryable: true,
        context
      }
    );
  }

  static isRetryable(error: unknown): boolean {
    return error instanceof BaseError && error.retryable;
  }

  static getRetryDelay(error: unknown): number {
    return error instanceof BaseError ? error.retryAfter : 5000;
  }
}
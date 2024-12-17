import { BaseError } from '../core/BaseError';
import { ErrorCode } from '../types/ErrorTypes';
import type { ErrorMetadata } from '../types/ErrorTypes';

export class AnalysisError extends BaseError {
  constructor(
    message: string,
    status: number = 500,
    details?: string,
    retryable: boolean = false,
    retryAfter: number = 5000,
    requestId?: string
  ) {
    super(message, {
      code: ErrorCode.ANALYSIS_ERROR,
      status,
      details,
      retryable,
      retryAfter,
      requestId
    });
  }

  static fromError(error: unknown, context?: Record<string, unknown>): AnalysisError {
    if (error instanceof AnalysisError) {
      return error;
    }

    return new AnalysisError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500,
      undefined,
      true,
      5000,
      undefined
    );
  }
}
import { BaseError } from '../../core/BaseError';

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
      status,
      details,
      retryable,
      retryAfter,
      requestId
    });
    this.name = 'AnalysisError';
  }

  static fromError(error: unknown): AnalysisError {
    if (error instanceof AnalysisError) {
      return error;
    }
    return new AnalysisError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500,
      undefined,
      true
    );
  }
}
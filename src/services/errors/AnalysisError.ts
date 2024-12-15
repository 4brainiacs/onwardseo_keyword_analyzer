import { logger } from '../../utils/logger';

export class AnalysisError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
    public readonly details?: string,
    public readonly retryable: boolean = false,
    public readonly retryAfter: number = 5000,
    public readonly requestId?: string
  ) {
    super(message);
    this.name = 'AnalysisError';
    Error.captureStackTrace(this, this.constructor);
    this.logError();
  }

  private logError(): void {
    logger.error(this.message, {
      error: this.toJSON()
    });
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
      retryable: this.retryable,
      retryAfter: this.retryAfter,
      requestId: this.requestId,
      stack: this.stack
    };
  }

  static fromError(error: unknown): AnalysisError {
    if (error instanceof AnalysisError) {
      return error;
    }

    if (error instanceof Error) {
      return new AnalysisError(
        error.message,
        500,
        error.stack,
        true
      );
    }

    return new AnalysisError(
      'An unexpected error occurred',
      500,
      String(error),
      true
    );
  }
}
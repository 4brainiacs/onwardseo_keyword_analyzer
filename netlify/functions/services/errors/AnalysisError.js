export class AnalysisError extends Error {
  constructor(
    message,
    status = 500,
    details = '',
    retryable = false,
    retryAfter = 5000,
    requestId = undefined
  ) {
    super(message);
    this.name = 'AnalysisError';
    this.status = status;
    this.details = details;
    this.retryable = retryable;
    this.retryAfter = retryAfter;
    this.requestId = requestId;
    Error.captureStackTrace(this, this.constructor);
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

  static fromError(error) {
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
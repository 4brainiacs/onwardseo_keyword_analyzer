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
    return new AnalysisError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500,
      undefined,
      true
    );
  }
}
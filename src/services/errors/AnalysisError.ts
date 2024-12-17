interface ErrorOptions {
  message: string;
  status?: number;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  requestId?: string;
}

export class AnalysisError extends Error {
  readonly status: number;
  readonly details?: string;
  readonly retryable: boolean;
  readonly retryAfter: number;
  readonly requestId?: string;

  constructor(options: ErrorOptions) {
    super(options.message);
    this.name = 'AnalysisError';
    this.status = options.status ?? 500;
    this.details = options.details;
    this.retryable = options.retryable ?? false;
    this.retryAfter = options.retryAfter ?? 5000;
    this.requestId = options.requestId;

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, AnalysisError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
      retryable: this.retryable,
      retryAfter: this.retryAfter,
      requestId: this.requestId
    };
  }

  static fromError(error: unknown): AnalysisError {
    if (error instanceof AnalysisError) {
      return error;
    }

    return new AnalysisError({
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      status: 500,
      retryable: true
    });
  }
}
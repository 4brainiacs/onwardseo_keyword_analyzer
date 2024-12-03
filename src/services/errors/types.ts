export class BaseError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
    public readonly details?: string,
    public readonly retryable: boolean = false,
    public readonly retryAfter?: number,
    public readonly requestId?: string
  ) {
    super(message);
    this.name = this.constructor.name;
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
      requestId: this.requestId
    };
  }
}

export class AnalysisError extends BaseError {
  static fromError(error: unknown, requestId?: string): AnalysisError {
    if (error instanceof AnalysisError) {
      return error;
    }

    return new AnalysisError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500,
      undefined,
      true,
      5000,
      requestId
    );
  }
}

export class NetworkError extends BaseError {
  constructor(message: string, details?: string) {
    super(message, 503, details, true, 5000);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, details?: string) {
    super(message, 400, details, false);
  }
}

export class ServerError extends BaseError {
  constructor(message: string, details?: string) {
    super(message, 500, details, true, 5000);
  }
}
export class BaseError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
    public readonly details?: string,
    public readonly retryable: boolean = false,
    public readonly retryAfter?: number,
    public readonly requestId?: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'BaseError';
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
      context: this.context
    };
  }

  static fromError(error: unknown): BaseError {
    if (error instanceof BaseError) {
      return error;
    }

    return new BaseError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500,
      undefined,
      true
    );
  }
}

export class AnalysisError extends BaseError {
  constructor(
    message: string,
    status: number = 500,
    details?: string,
    retryable: boolean = false,
    retryAfter?: number,
    requestId?: string,
    context?: Record<string, unknown>
  ) {
    super(message, status, details, retryable, retryAfter, requestId, context);
    this.name = 'AnalysisError';
  }
}

export class NetworkError extends BaseError {
  constructor(message: string, details?: string) {
    super(message, 503, details, true, 5000);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, details?: string) {
    super(message, 400, details, false);
    this.name = 'ValidationError';
  }
}

export class ServerError extends BaseError {
  constructor(message: string, details?: string) {
    super(message, 500, details, true, 5000);
    this.name = 'ServerError';
  }
}
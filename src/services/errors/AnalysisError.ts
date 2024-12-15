export class AnalysisError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details: string,
    public readonly retryable: boolean,
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
      requestId: this.requestId
    };
  }
}
export class AnalysisError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
    public readonly details?: string,
    public readonly retryable: boolean = false,
    public readonly retryAfter?: number,
    public readonly rawResponse?: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AnalysisError';

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);

    // Log error details
    console.error('Analysis Error:', {
      message,
      status,
      details,
      retryable,
      retryAfter,
      context,
      stack: this.stack
    });
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
      retryable: this.retryable,
      retryAfter: this.retryAfter
    };
  }
}
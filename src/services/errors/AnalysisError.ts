export interface ErrorMetadata {
  message: string;
  status?: number;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  requestId?: string;
  context?: Record<string, unknown>;
}

export class AnalysisError extends Error {
  readonly status: number;
  readonly details?: string;
  readonly retryable: boolean;
  readonly retryAfter: number;
  readonly requestId?: string;
  readonly context?: Record<string, unknown>;

  constructor(metadata: ErrorMetadata) {
    super(metadata.message);
    this.name = 'AnalysisError';
    this.status = metadata.status ?? 500;
    this.details = metadata.details;
    this.retryable = metadata.retryable ?? false;
    this.retryAfter = metadata.retryAfter ?? 5000;
    this.requestId = metadata.requestId;
    this.context = metadata.context;
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
      context: this.context,
      stack: this.stack
    };
  }
}
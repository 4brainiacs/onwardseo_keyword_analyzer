export interface ErrorOptions {
  status?: number;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  requestId?: string;
  context?: Record<string, unknown>;
}

export class BaseError extends Error {
  readonly status: number;
  readonly details?: string;
  readonly retryable: boolean;
  readonly retryAfter: number;
  readonly requestId?: string;
  readonly context?: Record<string, unknown>;

  constructor(message: string, options: ErrorOptions = {}) {
    super(message);
    this.name = this.constructor.name;
    this.status = options.status ?? 500;
    this.details = options.details;
    this.retryable = options.retryable ?? false;
    this.retryAfter = options.retryAfter ?? 5000;
    this.requestId = options.requestId;
    this.context = options.context;

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
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
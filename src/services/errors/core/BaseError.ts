import { logger } from '../../../utils/logger';

export interface ErrorMetadata {
  status?: number;
  code?: string;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  requestId?: string;
  context?: Record<string, unknown>;
}

export abstract class BaseError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: string;
  readonly retryable: boolean;
  readonly retryAfter: number;
  readonly requestId?: string;
  readonly context?: Record<string, unknown>;

  constructor(message: string, metadata: ErrorMetadata = {}) {
    super(message);
    this.name = this.constructor.name;
    this.status = metadata.status ?? 500;
    this.code = metadata.code ?? 'UNKNOWN_ERROR';
    this.details = metadata.details;
    this.retryable = metadata.retryable ?? false;
    this.retryAfter = metadata.retryAfter ?? 5000;
    this.requestId = metadata.requestId;
    this.context = metadata.context;

    Error.captureStackTrace(this, this.constructor);
    this.logError();
  }

  private logError(): void {
    logger.error(this.message, {
      error: {
        name: this.name,
        message: this.message,
        status: this.status,
        code: this.code,
        details: this.details,
        retryable: this.retryable,
        retryAfter: this.retryAfter,
        requestId: this.requestId,
        context: this.context,
        stack: this.stack
      }
    });
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
      retryable: this.retryable,
      retryAfter: this.retryAfter,
      requestId: this.requestId,
      context: this.context,
      stack: this.stack
    };
  }
}
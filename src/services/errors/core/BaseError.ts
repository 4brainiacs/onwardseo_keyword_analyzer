import { logger } from '../../../utils/logger';
import type { ErrorCode } from '../types/ErrorTypes';

export interface ErrorMetadata {
  code: ErrorCode;
  status?: number;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  requestId?: string;
  context?: Record<string, unknown>;
}

export class BaseError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: string;
  readonly retryable: boolean;
  readonly retryAfter: number;
  readonly requestId?: string;
  readonly context?: Record<string, unknown>;

  constructor(message: string, metadata: ErrorMetadata) {
    super(message);
    this.name = this.constructor.name;
    this.code = metadata.code;
    this.status = metadata.status ?? 500;
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
      error: this.toJSON(),
      context: this.context
    });
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      status: this.status,
      details: this.details,
      retryable: this.retryable,
      retryAfter: this.retryAfter,
      requestId: this.requestId,
      stack: this.stack
    };
  }
}
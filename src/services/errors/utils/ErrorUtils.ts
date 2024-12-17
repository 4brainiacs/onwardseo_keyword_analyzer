import { BaseError } from '../core/BaseError';

export class ErrorUtils {
  static isRetryable(error: unknown): boolean {
    return error instanceof BaseError && error.retryable;
  }

  static getRetryDelay(error: unknown): number {
    return error instanceof BaseError ? error.retryAfter : 5000;
  }

  static getErrorCode(error: unknown): string {
    return error instanceof BaseError ? error.code : 'UNKNOWN_ERROR';
  }

  static getErrorDetails(error: unknown): string | undefined {
    return error instanceof BaseError ? error.details : undefined;
  }

  static isServerError(error: unknown): boolean {
    return error instanceof BaseError && error.status >= 500;
  }
}
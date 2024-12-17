import { BaseError } from '../core/BaseError';
import { ErrorCode } from '../types/ErrorTypes';

export class ValidationError extends BaseError {
  constructor(message: string, details?: string) {
    super(message, {
      code: ErrorCode.VALIDATION_ERROR,
      status: 400,
      details,
      retryable: false
    });
  }

  static invalidInput(field: string, details?: string): ValidationError {
    return new ValidationError(
      `Invalid ${field}`,
      details || `The ${field} field has an invalid value`
    );
  }

  static required(field: string): ValidationError {
    return new ValidationError(
      `Missing ${field}`,
      `The ${field} field is required`
    );
  }
}
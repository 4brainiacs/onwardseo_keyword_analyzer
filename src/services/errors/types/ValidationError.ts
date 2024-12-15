import { BaseError, ErrorMetadata } from '../core/BaseError';

export class ValidationError extends BaseError {
  static readonly CODES = {
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_FIELD: 'MISSING_FIELD',
    TYPE_ERROR: 'TYPE_ERROR',
    CONSTRAINT_ERROR: 'CONSTRAINT_ERROR'
  } as const;

  constructor(message: string, metadata: ErrorMetadata = {}) {
    super(message, {
      ...metadata,
      code: metadata.code ?? ValidationError.CODES.INVALID_INPUT,
      status: metadata.status ?? 400,
      retryable: false
    });
  }

  static invalidInput(message: string, details?: string): ValidationError {
    return new ValidationError(message, {
      code: ValidationError.CODES.INVALID_INPUT,
      details
    });
  }

  static missingField(field: string): ValidationError {
    return new ValidationError(`Missing required field: ${field}`, {
      code: ValidationError.CODES.MISSING_FIELD,
      details: `The field "${field}" is required but was not provided`
    });
  }

  static typeError(field: string, expectedType: string): ValidationError {
    return new ValidationError(`Invalid type for field: ${field}`, {
      code: ValidationError.CODES.TYPE_ERROR,
      details: `Expected type "${expectedType}" for field "${field}"`
    });
  }
}
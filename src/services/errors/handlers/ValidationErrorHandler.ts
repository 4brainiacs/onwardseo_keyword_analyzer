import { ValidationError } from '../../domain/ValidationError';
import { logger } from '../../../utils/logger';
import { ErrorCode } from '../../types/ErrorTypes';

export class ValidationErrorHandler {
  static handle(error: unknown, field: string): never {
    logger.error('Validation error:', { error, field });

    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      `Invalid ${field}`,
      {
        code: ErrorCode.VALIDATION_ERROR,
        details: error instanceof Error ? error.message : 'Invalid input',
        retryable: false
      }
    );
  }

  static required(field: string): never {
    logger.error('Required field missing:', { field });
    
    throw new ValidationError(
      `Missing ${field}`,
      {
        code: ErrorCode.MISSING_FIELD,
        details: `The field "${field}" is required`,
        retryable: false
      }
    );
  }
}
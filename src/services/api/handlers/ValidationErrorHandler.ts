import { ValidationError } from '../../errors';
import { logger } from '../../../utils/logger';
import { ErrorCode } from '../types';

export class ValidationErrorHandler {
  static handle(error: unknown, field: string): never {
    logger.error('Validation error:', { error, field });

    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError(
      `Invalid ${field}`,
      400,
      error instanceof Error ? error.message : 'Invalid input',
      false
    );
  }

  static required(field: string): never {
    logger.error('Required field missing:', { field });
    
    throw new ValidationError(
      `Missing ${field}`,
      400,
      `The field "${field}" is required`,
      false
    );
  }
}
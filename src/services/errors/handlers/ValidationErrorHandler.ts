import { ValidationError } from '../domain/ValidationError';
import { logger } from '../../../utils/logger';

export class ValidationErrorHandler {
  static handle(error: unknown, field: string): never {
    logger.error('Validation error:', { error, field });

    if (error instanceof ValidationError) {
      throw error;
    }

    throw ValidationError.invalidInput(
      field,
      error instanceof Error ? error.message : 'Invalid input'
    );
  }

  static required(field: string): never {
    logger.error('Required field missing:', { field });
    throw ValidationError.required(field);
  }
}
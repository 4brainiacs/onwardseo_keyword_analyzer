import { BaseError } from '../../core/BaseError';

export class ValidationError extends BaseError {
  constructor(
    message: string,
    details?: string
  ) {
    super(message, {
      status: 400,
      details,
      retryable: false
    });
    this.name = 'ValidationError';
  }
}
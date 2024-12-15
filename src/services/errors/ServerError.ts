import { BaseError } from './BaseError';

export class ServerError extends BaseError {
  constructor(
    message: string,
    status: number = 500,
    details?: string
  ) {
    super(message, {
      status,
      details,
      retryable: true,
      retryAfter: 5000
    });
    this.name = 'ServerError';
  }
}
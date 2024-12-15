import { BaseError } from '../../core/BaseError';

export class NetworkError extends BaseError {
  constructor(
    message: string,
    status: number = 503,
    details?: string
  ) {
    super(message, {
      status,
      details,
      retryable: true,
      retryAfter: 5000
    });
    this.name = 'NetworkError';
  }
}
import { BaseError } from '../core/BaseError';
import { ErrorCode } from '../types/ErrorTypes';

export class NetworkError extends BaseError {
  constructor(message: string, metadata: {
    status?: number;
    details?: string;
    retryable?: boolean;
    retryAfter?: number;
  } = {}) {
    super(message, {
      code: ErrorCode.NETWORK_ERROR,
      status: metadata.status ?? 503,
      details: metadata.details,
      retryable: metadata.retryable ?? true,
      retryAfter: metadata.retryAfter
    });
  }

  static timeout(message = 'Request timed out'): NetworkError {
    return new NetworkError(message, {
      status: 408,
      details: 'The request took too long to complete',
      retryable: true,
      retryAfter: 5000
    });
  }
}
import { BaseError } from '../core/BaseError';
import { ErrorCode } from '../types/ErrorTypes';

export class ApiError extends BaseError {
  static readonly CODES = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'REQUEST_TIMEOUT',
    INVALID_RESPONSE: 'INVALID_RESPONSE',
    SERVER_ERROR: 'SERVER_ERROR'
  } as const;

  constructor(message: string, metadata: {
    status?: number;
    details?: string;
    retryable?: boolean;
    retryAfter?: number;
  } = {}) {
    super(message, {
      code: ErrorCode.INVALID_RESPONSE,
      ...metadata
    });
  }

  static networkError(details?: string): ApiError {
    return new ApiError('Network error occurred', {
      status: 503,
      details,
      retryable: true
    });
  }

  static timeout(details?: string): ApiError {
    return new ApiError('Request timed out', {
      status: 408,
      details,
      retryable: true
    });
  }
}
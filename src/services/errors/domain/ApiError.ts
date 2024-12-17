import { BaseError } from '../core/BaseError';
import { ErrorCode } from '../types/ErrorTypes';

export class ApiError extends BaseError {
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

  static invalidResponse(details?: string): ApiError {
    return new ApiError('Invalid server response', {
      status: 502,
      details,
      retryable: true
    });
  }

  static serverError(details?: string): ApiError {
    return new ApiError('Server error', {
      status: 500,
      details,
      retryable: true
    });
  }
}
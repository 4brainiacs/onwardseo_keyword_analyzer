import { BaseError, ErrorMetadata } from '../core/BaseError';

export class ApiError extends BaseError {
  static readonly CODES = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'REQUEST_TIMEOUT',
    INVALID_RESPONSE: 'INVALID_RESPONSE',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    STORAGE_ERROR: 'STORAGE_ERROR'
  } as const;

  constructor(message: string, metadata: ErrorMetadata = {}) {
    super(message, {
      ...metadata,
      code: metadata.code ?? ApiError.CODES.SERVER_ERROR
    });
  }

  static networkError(message: string, details?: string): ApiError {
    return new ApiError(message, {
      status: 503,
      code: ApiError.CODES.NETWORK_ERROR,
      details,
      retryable: true
    });
  }

  static timeout(message: string, details?: string): ApiError {
    return new ApiError(message, {
      status: 408,
      code: ApiError.CODES.TIMEOUT,
      details,
      retryable: true
    });
  }

  static storageError(message: string, details?: string): ApiError {
    return new ApiError(message, {
      status: 500,
      code: ApiError.CODES.STORAGE_ERROR,
      details,
      retryable: false
    });
  }
}
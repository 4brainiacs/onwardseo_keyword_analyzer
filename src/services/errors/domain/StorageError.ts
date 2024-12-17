import { BaseError } from '../core/BaseError';
import { ErrorCode } from '../types/ErrorTypes';

export class StorageError extends BaseError {
  constructor(message: string, details?: string) {
    super(message, {
      code: ErrorCode.STORAGE_ERROR,
      status: 500,
      details,
      retryable: false
    });
  }

  static quotaExceeded(details?: string): StorageError {
    return new StorageError(
      'Storage quota exceeded',
      details || 'Not enough storage space available'
    );
  }

  static accessDenied(details?: string): StorageError {
    return new StorageError(
      'Storage access denied',
      details || 'Cannot access storage in this context'
    );
  }

  static serializationError(details?: string): StorageError {
    return new StorageError(
      'Storage serialization failed',
      details || 'Failed to serialize/deserialize stored data'
    );
  }
}
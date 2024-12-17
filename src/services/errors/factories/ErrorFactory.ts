import { ErrorCode, ErrorMetadata } from '../types/ErrorTypes';
import { ApiError } from '../domain/ApiError';
import { NetworkError } from '../domain/NetworkError';
import { ValidationError } from '../domain/ValidationError';
import { AnalysisError } from '../domain/AnalysisError';

export class ErrorFactory {
  static create(code: ErrorCode, message: string, metadata: Partial<ErrorMetadata> = {}): Error {
    switch (code) {
      case ErrorCode.NETWORK_ERROR:
        return new NetworkError(message, metadata);
      
      case ErrorCode.INVALID_RESPONSE:
        return new ApiError(message, metadata);
      
      case ErrorCode.VALIDATION_ERROR:
        return new ValidationError(message, metadata.details);
      
      case ErrorCode.ANALYSIS_ERROR:
        return new AnalysisError(message, metadata);
      
      default:
        return new AnalysisError(message, {
          code: ErrorCode.SERVER_ERROR,
          ...metadata
        });
    }
  }

  static fromError(error: unknown, context?: Record<string, unknown>): Error {
    if (error instanceof Error) {
      return this.create(
        ErrorCode.SERVER_ERROR,
        error.message,
        { context }
      );
    }
    
    return this.create(
      ErrorCode.SERVER_ERROR,
      'An unexpected error occurred',
      { context }
    );
  }
}
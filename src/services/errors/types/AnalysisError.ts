import { BaseError, ErrorMetadata } from '../core/BaseError';

export class AnalysisError extends BaseError {
  static readonly CODES = {
    INVALID_RESPONSE: 'INVALID_RESPONSE',
    SCRAPING_FAILED: 'SCRAPING_FAILED',
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    SERVER_ERROR: 'SERVER_ERROR'
  } as const;

  constructor(message: string, metadata: ErrorMetadata = {}) {
    super(message, {
      ...metadata,
      code: metadata.code ?? AnalysisError.CODES.SERVER_ERROR
    });
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
      retryable: this.retryable,
      retryAfter: this.retryAfter,
      requestId: this.requestId
    };
  }

  static invalidResponse(details?: string): AnalysisError {
    return new AnalysisError('Invalid server response', {
      code: AnalysisError.CODES.INVALID_RESPONSE,
      status: 502,
      details,
      retryable: true
    });
  }

  static networkError(details?: string): AnalysisError {
    return new AnalysisError('Network error occurred', {
      code: AnalysisError.CODES.NETWORK_ERROR,
      status: 503,
      details,
      retryable: true
    });
  }

  static serverError(details?: string): AnalysisError {
    return new AnalysisError('Server error occurred', {
      code: AnalysisError.CODES.SERVER_ERROR,
      status: 500,
      details,
      retryable: true
    });
  }
}
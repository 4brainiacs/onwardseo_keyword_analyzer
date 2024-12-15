import { BaseError } from '../core/BaseError';

interface ErrorOptions {
  code?: string;
  status?: number;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  requestId?: string;
}

export class AnalysisError extends BaseError {
  static readonly CODES = {
    INVALID_RESPONSE: 'INVALID_RESPONSE',
    SCRAPING_FAILED: 'SCRAPING_FAILED',
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    SERVER_ERROR: 'SERVER_ERROR'
  } as const;

  constructor(message: string, options: ErrorOptions = {}) {
    super(message, {
      ...options,
      code: options.code ?? AnalysisError.CODES.SERVER_ERROR
    });
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
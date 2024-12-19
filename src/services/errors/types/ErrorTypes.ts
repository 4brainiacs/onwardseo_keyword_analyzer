export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  ANALYSIS_ERROR = 'ANALYSIS_ERROR',
  SCRAPING_ERROR = 'SCRAPING_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR'
}

export interface ErrorMetadata {
  code: ErrorCode;
  status?: number;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  requestId?: string;
  context?: Record<string, unknown>;
}
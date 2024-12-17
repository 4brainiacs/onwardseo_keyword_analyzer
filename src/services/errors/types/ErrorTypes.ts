export enum ErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  
  // API errors
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  
  // Storage errors
  STORAGE_ERROR = 'STORAGE_ERROR',
  
  // Analysis errors
  ANALYSIS_ERROR = 'ANALYSIS_ERROR',
  SCRAPING_ERROR = 'SCRAPING_ERROR'
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

// Re-export for convenience
export type { ErrorMetadata as default };
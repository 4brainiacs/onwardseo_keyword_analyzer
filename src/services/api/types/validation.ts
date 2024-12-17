export interface ValidationResult {
  isValid: boolean;
  error?: string;
  details?: string;
}

export interface ValidationContext {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
}

export interface ErrorMetadata {
  message: string;
  status?: number;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  requestId?: string;
  context?: Record<string, unknown>;
}
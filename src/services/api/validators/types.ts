export interface ValidationResult {
  isValid: boolean;
  error?: string;
  details?: string;
}

export interface ValidationContext {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ValidationContext {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
}
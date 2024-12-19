export interface ValidationResult {
  isValid: boolean;
  error?: string;
  details?: string;
}

export interface ValidationContext {
  field?: string;
  value?: unknown;
  metadata?: Record<string, unknown>;
}

export interface ValidationRule<T = unknown> {
  validate: (value: T, context?: ValidationContext) => ValidationResult;
  message: string;
}
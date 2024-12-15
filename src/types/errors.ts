export interface ErrorMetadata {
  message: string;
  status?: number;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
}
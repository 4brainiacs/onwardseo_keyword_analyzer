import { BaseError } from './BaseError';
import { AnalysisError } from './AnalysisError';
import { NetworkError } from './NetworkError';
import { ValidationError } from './ValidationError';
import { ServerError } from './ServerError';

export interface ErrorOptions {
  status?: number;
  details?: string;
  retryable?: boolean;
  retryAfter?: number;
  requestId?: string;
  context?: Record<string, unknown>;
}

export interface ErrorContext {
  url?: string;
  component?: string;
  retryCount?: number;
  additionalInfo?: Record<string, unknown>;
}

export {
  BaseError,
  AnalysisError,
  NetworkError,
  ValidationError,
  ServerError
};
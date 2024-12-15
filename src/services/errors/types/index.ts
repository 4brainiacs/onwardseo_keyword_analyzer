import { BaseError } from '../core/BaseError';
import { AnalysisError } from './domain/AnalysisError';
import { NetworkError } from './http/NetworkError';
import { ValidationError } from './validation/ValidationError';
import { ServerError } from './http/ServerError';

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
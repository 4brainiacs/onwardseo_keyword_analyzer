import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export function handleApiError(error: unknown, requestId?: string): AnalysisError {
  logger.error('API Error:', { error, requestId });

  if (error instanceof AnalysisError) {
    return error;
  }

  if (error instanceof TypeError) {
    if (error.message.includes('Failed to fetch')) {
      return new AnalysisError(
        'Network error',
        503,
        'Unable to connect to the server. Please check your connection.',
        true,
        5000,
        requestId
      );
    }

    if (error.message.includes('aborted')) {
      return new AnalysisError(
        'Request timeout',
        408,
        'The request took too long to complete. Please try again.',
        true,
        5000,
        requestId
      );
    }
  }

  return new AnalysisError(
    'Request failed',
    500,
    error instanceof Error ? error.message : 'An unexpected error occurred',
    true,
    5000,
    requestId
  );
}
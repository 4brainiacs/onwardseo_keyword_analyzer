import { StatusCodes } from 'http-status-codes';
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export function handleApiError(error: unknown): never {
  logger.error('API Error:', error);

  if (error instanceof AnalysisError) {
    throw error;
  }

  if (error instanceof TypeError) {
    if (error.message.includes('Failed to fetch')) {
      throw new AnalysisError(
        'Network error',
        StatusCodes.SERVICE_UNAVAILABLE,
        'Unable to connect to the server. Please check your connection.',
        true
      );
    }

    if (error.message.includes('aborted')) {
      throw new AnalysisError(
        'Request timeout',
        StatusCodes.REQUEST_TIMEOUT,
        'The request took too long to complete',
        true
      );
    }
  }

  throw new AnalysisError(
    'Request failed',
    StatusCodes.INTERNAL_SERVER_ERROR,
    error instanceof Error ? error.message : 'An unexpected error occurred',
    true
  );
}
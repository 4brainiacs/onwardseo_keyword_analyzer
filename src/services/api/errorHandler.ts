import { AnalysisError } from '../errors/AnalysisError';
import { logger } from '../../utils/logger';

export function handleApiError(error: unknown): never {
  logger.error('API Error:', { error });

  if (error instanceof AnalysisError) {
    throw error;
  }

  if (error instanceof Response) {
    throw new AnalysisError(
      'Request failed',
      error.status,
      `Server returned status ${error.status}`,
      error.status >= 500
    );
  }

  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    throw new AnalysisError(
      'Network error',
      503,
      'Unable to connect to the server. Please check your connection.',
      true
    );
  }

  throw new AnalysisError(
    'Request failed',
    500,
    error instanceof Error ? error.message : 'An unexpected error occurred',
    true
  );
}
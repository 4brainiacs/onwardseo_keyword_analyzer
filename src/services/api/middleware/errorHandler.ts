import { AnalysisError, NetworkError, ServerError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { ApiResponse } from '../types';

export async function handleApiError(error: unknown, requestId?: string): Promise<never> {
  logger.error('API Error:', { error, requestId });

  if (error instanceof AnalysisError) {
    throw error;
  }

  if (error instanceof Response) {
    let errorData: ApiResponse;
    try {
      const text = await error.text();
      errorData = JSON.parse(text);
      throw new ServerError(
        errorData.error || 'Request failed',
        errorData.details || `Server returned status ${error.status}`
      );
    } catch (parseError) {
      throw new ServerError(
        'Request failed',
        `Server returned status ${error.status}`
      );
    }
  }

  if (error instanceof TypeError) {
    if (error.message.includes('Failed to fetch')) {
      throw new NetworkError(
        'Network error',
        'Unable to connect to the server. Please check your connection.'
      );
    }
    if (error.message.includes('aborted')) {
      throw new NetworkError(
        'Request timeout',
        'The request took too long to complete. Please try again.'
      );
    }
  }

  throw new AnalysisError(
    error instanceof Error ? error.message : 'An unexpected error occurred',
    500,
    undefined,
    true,
    5000,
    requestId
  );
}
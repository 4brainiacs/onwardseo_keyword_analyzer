import { AnalysisError } from '../../errors/AnalysisError';
import { logger } from '../../../utils/logger';
import type { ApiResponse } from '../types';

export async function validateResponse<T>(response: Response): Promise<T> {
  try {
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new AnalysisError({
        message: 'Invalid content type',
        status: 415,
        details: `Expected JSON but received: ${contentType}`,
        retryable: false
      });
    }

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      throw new AnalysisError({
        message: error.message || 'Request failed',
        status: response.status,
        details: error.details || `Server returned status ${response.status}`,
        retryable: response.status >= 500
      });
    }

    const data = await response.json() as ApiResponse<T>;

    if (!data.success || !data.data) {
      throw new AnalysisError({
        message: data.error || 'Invalid response format',
        status: data.status || 500,
        details: data.details || 'Server returned unsuccessful response',
        retryable: data.retryable || false,
        retryAfter: data.retryAfter
      });
    }

    return data.data;
  } catch (error) {
    logger.error('Response validation failed:', error);
    throw error instanceof AnalysisError ? error : new AnalysisError({
      message: 'Failed to validate response',
      status: 500,
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      retryable: true
    });
  }
}

async function parseErrorResponse(response: Response): Promise<{
  message?: string;
  details?: string;
}> {
  try {
    const data = await response.json();
    return {
      message: data.error,
      details: data.details
    };
  } catch {
    return {
      message: `HTTP ${response.status}`,
      details: response.statusText
    };
  }
}
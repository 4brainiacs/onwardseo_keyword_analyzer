import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { ApiResponse } from '../types';

export async function validateResponse<T>(
  response: Response, 
  data: unknown
): Promise<ApiResponse<T>> {
  const requestId = response.headers.get('X-Request-ID');

  try {
    if (!response.ok) {
      const errorData = data as ApiResponse;
      throw new AnalysisError(
        errorData.error || 'Request failed',
        response.status,
        errorData.details || `Server returned status ${response.status}`,
        response.status >= 500,
        errorData.retryAfter,
        requestId
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new AnalysisError(
        'Invalid content type',
        500,
        `Expected JSON but received: ${contentType || 'no content type'}`,
        true,
        5000,
        requestId
      );
    }

    if (!data || typeof data !== 'object') {
      throw new AnalysisError(
        'Invalid response format',
        500,
        'Server returned unexpected data format',
        true,
        5000,
        requestId
      );
    }

    const apiResponse = data as ApiResponse<T>;

    if (!apiResponse.success) {
      throw new AnalysisError(
        apiResponse.error || 'Request failed',
        500,
        apiResponse.details,
        true,
        apiResponse.retryAfter,
        requestId
      );
    }

    return apiResponse;
  } catch (error) {
    logger.error('Response validation failed:', { error, requestId });
    throw error instanceof AnalysisError ? error : new AnalysisError(
      'Invalid response format',
      500,
      error instanceof Error ? error.message : 'Unknown error occurred',
      true,
      5000,
      requestId
    );
  }
}
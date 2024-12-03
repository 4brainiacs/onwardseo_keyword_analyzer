import { AnalysisError } from '../errors/AnalysisError';
import { logger } from '../../utils/logger';
import { validateResponse } from '../validation/responseValidator';

export async function handleApiResponse<T>(response: Response): Promise<T> {
  try {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        throw new AnalysisError(
          'Request failed',
          response.status,
          `Server returned status ${response.status}`
        );
      }

      throw new AnalysisError(
        errorData.error || 'Request failed',
        response.status,
        errorData.details,
        errorData.retryable,
        errorData.retryAfter
      );
    }

    // Validate the response format
    const data = await validateResponse(response);

    // Log successful response
    logger.info('API request successful', {
      status: response.status,
      url: response.url
    });

    return data as T;
  } catch (error) {
    // Log the error with context
    logger.error('API response handling failed:', {
      error,
      status: response.status,
      url: response.url
    });

    // Re-throw analysis errors
    if (error instanceof AnalysisError) {
      throw error;
    }

    // Handle other errors
    throw new AnalysisError(
      'Failed to process response',
      500,
      error instanceof Error ? error.message : 'Unknown error occurred',
      true
    );
  }
}
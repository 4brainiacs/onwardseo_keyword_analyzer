import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { HTTP_STATUS, API_CONSTANTS } from '../constants/http';

export class ErrorHandler {
  static handle(error: unknown): never {
    logger.error('API Error:', { error });

    if (error instanceof AnalysisError) {
      throw error;
    }

    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        throw new AnalysisError(
          'Network error',
          HTTP_STATUS.SERVICE_UNAVAILABLE,
          'Unable to connect to the server',
          true
        );
      }

      if (error.message.includes('aborted')) {
        throw new AnalysisError(
          'Request timeout',
          HTTP_STATUS.TIMEOUT,
          'The request took too long to complete',
          true
        );
      }
    }

    throw new AnalysisError(
      'Request failed',
      HTTP_STATUS.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'An unexpected error occurred',
      true
    );
  }

  static async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}`;
    let errorDetails = response.statusText;
    let retryable = response.status >= 500;
    let retryAfter = API_CONSTANTS.TIMEOUTS.RETRY;

    try {
      const text = await response.text();
      if (text) {
        const errorData = JSON.parse(text);
        if (errorData.error) {
          errorMessage = errorData.error;
          errorDetails = errorData.details || errorDetails;
          retryable = errorData.retryable ?? retryable;
          retryAfter = errorData.retryAfter ?? retryAfter;
        }
      }
    } catch (error) {
      logger.error('Failed to parse error response:', error);
    }

    throw new AnalysisError(
      errorMessage,
      response.status,
      errorDetails,
      retryable,
      retryAfter
    );
  }
}
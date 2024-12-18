import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS } from '../constants';

export class ErrorHandler {
  handleApiError(error: unknown, context?: Record<string, unknown>): never {
    logger.error('API Error:', { error, context });

    if (error instanceof AnalysisError) {
      throw error;
    }

    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        throw new AnalysisError({
          message: API_CONSTANTS.ERROR_MESSAGES.NETWORK.CONNECTION,
          status: 503,
          details: 'Unable to connect to the server',
          retryable: true
        });
      }

      if (error.message.includes('aborted')) {
        throw new AnalysisError({
          message: API_CONSTANTS.ERROR_MESSAGES.NETWORK.TIMEOUT,
          status: 408,
          details: 'The request took too long to complete',
          retryable: true
        });
      }
    }

    throw new AnalysisError({
      message: 'Request failed',
      status: 500,
      details: error instanceof Error ? error.message : 'An unexpected error occurred',
      retryable: true
    });
  }

  async handleErrorResponse(response: Response): Promise<never> {
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

    throw new AnalysisError({
      message: errorMessage,
      status: response.status,
      details: errorDetails,
      retryable,
      retryAfter
    });
  }
}
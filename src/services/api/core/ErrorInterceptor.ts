import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export class ErrorInterceptor {
  handle(error: unknown): never {
    logger.error('API Error:', { error });

    if (error instanceof AnalysisError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new AnalysisError(
        ERROR_MESSAGES.NETWORK.CONNECTION,
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        'Unable to connect to the server',
        true
      );
    }

    if (error instanceof TypeError && error.message.includes('aborted')) {
      throw new AnalysisError(
        ERROR_MESSAGES.NETWORK.TIMEOUT,
        HTTP_STATUS.REQUEST_TIMEOUT,
        ERROR_MESSAGES.NETWORK.TIMEOUT_DETAILS,
        true
      );
    }

    throw new AnalysisError(
      'Request failed',
      HTTP_STATUS.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'An unexpected error occurred',
      true
    );
  }
}
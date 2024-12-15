import { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { ERROR_MESSAGES } from '../constants';

export class ErrorInterceptor {
  handle(error: unknown): never {
    logger.error('API request failed:', error);

    if (error instanceof AnalysisError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      throw this.handleAxiosError(error);
    }

    throw new AnalysisError(
      'Request failed',
      StatusCodes.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'An unexpected error occurred',
      true
    );
  }

  private handleAxiosError(error: AxiosError): AnalysisError {
    if (error.code === 'ECONNABORTED') {
      return new AnalysisError(
        ERROR_MESSAGES.NETWORK.TIMEOUT,
        StatusCodes.REQUEST_TIMEOUT,
        ERROR_MESSAGES.NETWORK.TIMEOUT_DETAILS,
        true
      );
    }

    return new AnalysisError(
      ERROR_MESSAGES.NETWORK.CONNECTION,
      error.response?.status || StatusCodes.SERVICE_UNAVAILABLE,
      error.message,
      true
    );
  }
}
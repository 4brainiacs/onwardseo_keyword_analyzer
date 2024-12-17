import { ErrorFactory } from '../factories/ErrorFactory';
import { ErrorCode } from '../types/ErrorTypes';
import { logger } from '../../../utils/logger';

export class ApiErrorHandler {
  static handle(error: unknown, context?: Record<string, unknown>): never {
    logger.error('API Error:', { error, context });

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw ErrorFactory.create(ErrorCode.NETWORK_ERROR, 'Network error', {
        status: 503,
        details: 'Unable to connect to the server',
        retryable: true,
        context
      });
    }

    throw ErrorFactory.fromError(error, context);
  }

  static handleResponse(response: Response): void {
    if (!response.ok) {
      throw ErrorFactory.create(ErrorCode.SERVER_ERROR, 'Server error', {
        status: response.status,
        details: response.statusText,
        retryable: response.status >= 500
      });
    }
  }
}
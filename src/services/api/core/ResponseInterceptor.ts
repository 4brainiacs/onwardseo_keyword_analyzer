import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS, ERROR_MESSAGES } from '../constants';

export class ResponseInterceptor {
  async handle(response: AxiosResponse): Promise<any> {
    const contentType = response.headers[API_CONSTANTS.HEADERS.CONTENT_TYPE];
    
    if (!contentType?.includes(API_CONSTANTS.CONTENT_TYPES.JSON)) {
      logger.error('Invalid content type:', { contentType });
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.CONTENT_TYPE,
        StatusCodes.UNSUPPORTED_MEDIA_TYPE,
        `Expected JSON but received: ${contentType}`,
        true
      );
    }

    const data = response.data;
    if (!data || typeof data !== 'object') {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.INVALID_RESPONSE,
        StatusCodes.BAD_GATEWAY,
        'Server returned unexpected data format',
        true
      );
    }

    if (!data.success) {
      throw new AnalysisError(
        data.error || 'Request failed',
        response.status,
        data.details,
        response.status >= 500,
        data.retryAfter
      );
    }

    return data.data;
  }
}
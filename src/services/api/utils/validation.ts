import { StatusCodes } from 'http-status-codes';
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS, ERROR_MESSAGES } from '../constants';
import type { ApiResponse } from '../types/responses';

export function validateContentType(response: Response): void {
  const contentType = response.headers.get(API_CONSTANTS.HEADERS.CONTENT_TYPE)?.toLowerCase();
  
  if (!contentType) {
    logger.error('Missing content type header');
    throw new AnalysisError(
      ERROR_MESSAGES.VALIDATION.CONTENT_TYPE,
      StatusCodes.UNSUPPORTED_MEDIA_TYPE,
      ERROR_MESSAGES.VALIDATION.MISSING_CONTENT_TYPE,
      true
    );
  }

  // Check if content type contains application/json, ignoring charset
  if (!contentType.includes(API_CONSTANTS.CONTENT_TYPES.JSON)) {
    logger.error('Invalid content type:', { contentType });
    throw new AnalysisError(
      ERROR_MESSAGES.VALIDATION.CONTENT_TYPE,
      StatusCodes.UNSUPPORTED_MEDIA_TYPE,
      `Expected JSON but received: ${contentType}`,
      true
    );
  }
}

export function validateApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success || !response.data) {
    throw new AnalysisError(
      response.error || ERROR_MESSAGES.VALIDATION.INVALID_RESPONSE,
      StatusCodes.BAD_GATEWAY,
      response.details || 'The server returned an unsuccessful response',
      true,
      response.retryAfter
    );
  }

  return response.data;
}
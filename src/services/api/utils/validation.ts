import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS } from '../constants';
import type { ApiResponse } from '../types';

export function validateContentType(response: Response): void {
  const contentType = response.headers.get(API_CONSTANTS.HEADERS.CONTENT_TYPE);
  
  if (!contentType) {
    throw new AnalysisError({
      message: API_CONSTANTS.ERROR_MESSAGES.VALIDATION.MISSING_CONTENT_TYPE,
      status: 415,
      details: 'Response is missing content type header',
      retryable: true
    });
  }

  if (!contentType.toLowerCase().includes(API_CONSTANTS.CONTENT_TYPES.JSON)) {
    throw new AnalysisError({
      message: API_CONSTANTS.ERROR_MESSAGES.VALIDATION.INVALID_CONTENT,
      status: 415,
      details: `Expected JSON but received: ${contentType}`,
      retryable: false
    });
  }
}

export function validateApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new AnalysisError({
      message: response.error,
      status: response.status,
      details: response.details,
      retryable: response.retryable,
      retryAfter: response.retryAfter
    });
  }

  return response.data;
}
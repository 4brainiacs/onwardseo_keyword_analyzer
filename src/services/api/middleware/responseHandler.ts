import { StatusCodes } from 'http-status-codes';
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS } from '../constants';
import type { ApiResponse } from '../types';

export async function handleApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  
  logger.debug('Raw response:', {
    status: response.status,
    contentType: response.headers.get(API_CONSTANTS.HEADERS.CONTENT_TYPE),
    body: text.slice(0, 200)
  });

  if (!response.ok) {
    let errorMessage = 'Request failed';
    let errorDetails = `Server returned status ${response.status}`;

    try {
      const errorResponse = JSON.parse(text);
      if (errorResponse.error) {
        errorMessage = errorResponse.error;
        errorDetails = errorResponse.details || errorDetails;
      }
    } catch {
      // Use default error message if response isn't valid JSON
    }

    throw new AnalysisError(
      errorMessage,
      response.status,
      errorDetails,
      response.status >= 500
    );
  }

  const contentType = response.headers.get(API_CONSTANTS.HEADERS.CONTENT_TYPE)?.toLowerCase();
  if (!contentType?.includes('application/json')) {
    throw new AnalysisError(
      'Invalid content type',
      StatusCodes.UNSUPPORTED_MEDIA_TYPE,
      `Expected JSON but received: ${contentType}`,
      true
    );
  }

  try {
    const data = JSON.parse(text) as ApiResponse<T>;
    
    if (!data.success || !data.data) {
      throw new AnalysisError(
        data.error || 'Invalid response format',
        StatusCodes.BAD_GATEWAY,
        data.details || 'Server returned an unsuccessful response',
        true,
        data.retryAfter
      );
    }

    return data.data;
  } catch (error) {
    if (error instanceof AnalysisError) {
      throw error;
    }

    logger.error('Response parsing error:', error);
    throw new AnalysisError(
      'Invalid JSON response',
      StatusCodes.BAD_GATEWAY,
      'Server returned invalid JSON data',
      true
    );
  }
}
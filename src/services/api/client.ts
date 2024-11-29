import { ApiResponse } from './types';
import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import { ResponseValidator } from './responseValidator';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    // Validate response headers and status
    ResponseValidator.validateContentType(response);
    ResponseValidator.validateStatus(response);

    // Parse and validate response body
    const data = await ResponseValidator.validateResponseBody(response);

    // Additional validation for ScrapingBee response
    ResponseValidator.validateScrapingBeeResponse(data);

    return data.data;
  } catch (error) {
    if (error instanceof AnalysisError) {
      throw error;
    }

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new AnalysisError(
        'Network error',
        500,
        'Failed to connect to the server'
      );
    }

    throw new AnalysisError(
      'Request failed',
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}
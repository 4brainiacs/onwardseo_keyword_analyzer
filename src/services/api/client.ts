import type { ApiResponse } from './types';
import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import { ResponseValidator } from './validators/responseValidator';

export async function fetchApi<T extends object>(
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

    ResponseValidator.validateContentType(response);
    ResponseValidator.validateStatus(response);

    const apiResponse = await ResponseValidator.validateResponseBody<ApiResponse<T>>(response);

    if (!apiResponse.success || !apiResponse.data) {
      throw new AnalysisError('Invalid response format', 500);
    }

    return apiResponse.data;
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
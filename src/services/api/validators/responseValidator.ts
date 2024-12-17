import { AnalysisError } from '../../errors/AnalysisError';
import { logger } from '../../../utils/logger';
import type { ApiResponse } from '../types';

export async function validateResponse<T>(response: Response): Promise<T> {
  try {
    // Validate content type
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new AnalysisError({
        message: 'Invalid content type',
        status: 415,
        details: `Expected JSON but received: ${contentType}`,
        retryable: false
      });
    }

    // Check response status
    if (!response.ok) {
      const error = await parseErrorResponse(response);
      throw new AnalysisError({
        message: error.message || 'Request failed',
        status: response.status,
        details: error.details || `Server returned status ${response.status}`,
        retryable: response.status >= 500
      });
    }

    // Parse response
    const text = await response.text();
    if (!text) {
      throw new AnalysisError({
        message: 'Empty response',
        status: 500,
        details: 'Server returned empty response',
        retryable: true
      });
    }

    let data: ApiResponse<T>;
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new AnalysisError({
        message: 'Invalid JSON response',
        status: 500,
        details: 'Server returned invalid JSON data',
        retryable: true
      });
    }

    if (!data.success || !data.data) {
      throw new AnalysisError({
        message: data.error || 'Invalid response format',
        status: 500,
        details: data.details || 'Server returned unsuccessful response',
        retryable: true
      });
    }

    return data.data;
  } catch (error) {
    logger.error('Response validation failed:', error);
    throw error instanceof AnalysisError ? error : new AnalysisError({
      message: 'Failed to validate response',
      status: 500,
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      retryable: true
    });
  }
}

async function parseErrorResponse(response: Response): Promise<{
  message?: string;
  details?: string;
}> {
  try {
    const data = await response.json();
    return {
      message: data.error,
      details: data.details
    };
  } catch {
    return {
      message: `HTTP ${response.status}`,
      details: response.statusText
    };
  }
}
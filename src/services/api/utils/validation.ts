import { AnalysisError } from '../../errors/AnalysisError';
import { logger } from '../../../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import type { ApiResponse } from '../types';

export async function validateResponse<T>(response: Response): Promise<T> {
  try {
    // First validate content type
    const contentType = response.headers.get('content-type');
    if (!contentType?.toLowerCase().includes('application/json')) {
      logger.error('Invalid content type received:', { contentType });
      throw new AnalysisError(
        'Invalid content type',
        415,
        `Expected JSON but received: ${contentType}`,
        false
      );
    }

    // Get response text first to handle HTML error pages
    const text = await response.text();
    
    // Check for HTML content which indicates an error page
    if (text.trim().toLowerCase().startsWith('<!doctype html') || 
        text.trim().toLowerCase().startsWith('<html')) {
      logger.error('HTML response received instead of JSON');
      throw new AnalysisError(
        'Invalid response format',
        502,
        'Server returned HTML instead of JSON. This usually indicates a server error.',
        true
      );
    }

    // Try to parse JSON
    let data: ApiResponse<T>;
    try {
      data = JSON.parse(text);
    } catch (error) {
      logger.error('JSON parse error:', { error, responsePreview: text.slice(0, 200) });
      throw new AnalysisError(
        'Invalid JSON response',
        502,
        'Server returned invalid JSON data',
        true
      );
    }

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new AnalysisError(
        'Invalid response format',
        502,
        'Server returned unexpected data format',
        true
      );
    }

    // Check success flag and data presence
    if (!data.success || !data.data) {
      const errorMessage = data.error || 'Invalid response format';
      const errorDetails = data.details || 'Server returned unsuccessful response';
      
      throw new AnalysisError(
        errorMessage,
        response.status,
        errorDetails,
        response.status >= 500,
        data.retryAfter
      );
    }

    return data.data;
  } catch (error) {
    if (error instanceof AnalysisError) {
      throw error;
    }

    logger.error('Response validation failed:', error);
    throw new AnalysisError(
      'Failed to validate response',
      502,
      error instanceof Error ? error.message : 'Unknown error occurred',
      true
    );
  }
}
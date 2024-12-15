import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export async function validateResponse<T>(response: Response, text: string): Promise<T> {
  try {
    // Validate content type
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      logger.error('Invalid content type:', { contentType });
      throw new AnalysisError(
        'Invalid content type',
        500,
        `Expected JSON but received: ${contentType}`,
        true
      );
    }

    // Parse JSON response
    let data: T;
    try {
      data = JSON.parse(text);
    } catch (error) {
      logger.error('JSON parse error:', { error, text: text.slice(0, 200) });
      throw new AnalysisError(
        'Invalid JSON response',
        500,
        'Server returned invalid JSON data',
        true
      );
    }

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new AnalysisError(
        'Invalid response format',
        500,
        'Server returned unexpected data format',
        true
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AnalysisError) {
      throw error;
    }

    logger.error('Response validation failed:', error);
    throw new AnalysisError(
      'Invalid response',
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred',
      true
    );
  }
}
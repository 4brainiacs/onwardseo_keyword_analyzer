import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export class ResponseHandler {
  async handleResponse<T>(response: Response): Promise<T> {
    try {
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new AnalysisError(
          'Invalid content type',
          415,
          `Expected JSON but received: ${contentType}`,
          false
        );
      }

      const text = await response.text();
      if (!text.trim()) {
        throw new AnalysisError(
          'Empty response',
          500,
          'Server returned empty response',
          true
        );
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new AnalysisError(
          'Invalid JSON response',
          500,
          'Server returned invalid JSON data',
          true
        );
      }

      if (!data.success || !data.data) {
        throw new AnalysisError(
          data.error || 'Request failed',
          data.status || 500,
          data.details || 'Server returned unsuccessful response',
          data.retryable || false,
          data.retryAfter
        );
      }

      return data.data;
    } catch (error) {
      logger.error('Response handling failed:', error);
      throw error instanceof AnalysisError ? error : new AnalysisError(
        'Failed to process response',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}
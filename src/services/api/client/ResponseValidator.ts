import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export class ResponseValidator {
  static async validate<T>(response: Response): Promise<T> {
    try {
      // Check response status first
      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw new AnalysisError(
          error.message || 'Request failed',
          response.status,
          error.details || `Server returned status ${response.status}`,
          response.status >= 500
        );
      }

      // Validate content type
      const contentType = response.headers.get('content-type');
      if (!contentType?.toLowerCase().includes('application/json')) {
        throw new AnalysisError(
          'Invalid content type',
          415,
          `Expected JSON but received: ${contentType}`,
          false
        );
      }

      // Get and validate response text
      const text = await response.text();
      if (!text.trim()) {
        throw new AnalysisError(
          'Empty response',
          502,
          'Server returned empty response',
          true
        );
      }

      // Parse JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        logger.error('JSON parse error:', { error, responseText: text.slice(0, 200) });
        throw new AnalysisError(
          'Invalid JSON response',
          502,
          'Server returned invalid JSON data',
          true
        );
      }

      // Validate response structure
      if (!data?.success || !data?.data) {
        throw new AnalysisError(
          'Invalid response format',
          502,
          'Response missing required fields',
          true
        );
      }

      return data.data;
    } catch (error) {
      logger.error('Response validation failed:', error);
      throw error instanceof AnalysisError ? error : new AnalysisError(
        'Failed to validate response',
        502,
        error instanceof Error ? error.message : 'Unknown error occurred',
        true
      );
    }
  }

  private static async parseErrorResponse(response: Response): Promise<{ message?: string; details?: string }> {
    try {
      const text = await response.text();
      const data = JSON.parse(text);
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
}
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export class ResponseHandler {
  async validateResponse(response: Response): Promise<void> {
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      throw new AnalysisError(
        'Invalid content type',
        415,
        `Expected JSON but received: ${contentType}`,
        false
      );
    }

    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      throw new AnalysisError(
        error.message || 'Request failed',
        response.status,
        error.details || `Server returned status ${response.status}`,
        response.status >= 500
      );
    }
  }

  async parseResponse<T>(response: Response): Promise<T> {
    try {
      const text = await response.text();
      
      if (!text.trim()) {
        throw new AnalysisError(
          'Empty response',
          500,
          'Server returned empty response',
          true
        );
      }

      const data = JSON.parse(text);
      
      if (!data || typeof data !== 'object') {
        throw new AnalysisError(
          'Invalid response format',
          500,
          'Server returned unexpected data format',
          true
        );
      }

      if (!data.success || !data.data) {
        throw new AnalysisError(
          data.error || 'Request failed',
          500,
          data.details || 'Server returned unsuccessful response',
          true
        );
      }

      return data.data;
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }

      logger.error('Response parsing failed:', error);
      throw new AnalysisError(
        'Invalid response',
        500,
        error instanceof Error ? error.message : 'Failed to parse server response',
        true
      );
    }
  }

  private async parseErrorResponse(response: Response): Promise<{ message?: string; details?: string }> {
    try {
      const data = await response.json();
      return {
        message: data.error,
        details: data.details
      };
    } catch (error) {
      logger.error('Failed to parse error response:', error);
      return {
        message: `HTTP ${response.status}`,
        details: response.statusText
      };
    }
  }
}
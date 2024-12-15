import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { AnalysisResult } from '../../../types';

export class ResponseValidator {
  async validateResponse(response: Response): Promise<void> {
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      logger.error('Invalid content type received:', {
        contentType,
        status: response.status,
        responsePreview: text.slice(0, 200)
      });
      
      throw new AnalysisError(
        'Invalid content type',
        500,
        `Expected JSON but received: ${contentType}`,
        true
      );
    }

    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      throw new AnalysisError(
        error.message || 'Request failed',
        response.status,
        error.details,
        response.status >= 500
      );
    }
  }

  async parseErrorResponse(response: Response): Promise<{ message?: string; details?: string }> {
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

  validateAnalysisResult(data: unknown): AnalysisResult {
    if (!data || typeof data !== 'object') {
      throw new AnalysisError(
        'Invalid response format',
        500,
        'Server returned unexpected data format',
        true
      );
    }

    const apiResponse = data as any;
    
    if (!apiResponse.success || !apiResponse.data) {
      throw new AnalysisError(
        apiResponse.error || 'Request failed',
        apiResponse.status || 500,
        apiResponse.details || 'Server returned unsuccessful response',
        apiResponse.retryable || false,
        apiResponse.retryAfter
      );
    }

    return apiResponse.data;
  }
}
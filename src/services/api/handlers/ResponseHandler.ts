import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { ApiResponse } from '../types';

export class ResponseHandler {
  async handleResponse<T>(response: Response): Promise<T> {
    try {
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new AnalysisError('Invalid content type', {
          status: 415,
          details: `Expected JSON but received: ${contentType}`,
          retryable: false
        });
      }

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw new AnalysisError('Request failed', {
          status: response.status,
          details: error.details || `Server returned status ${response.status}`,
          retryable: response.status >= 500
        });
      }

      const text = await response.text();
      if (!text) {
        throw new AnalysisError('Empty response', {
          status: 500,
          details: 'Server returned empty response',
          retryable: true
        });
      }

      let data: ApiResponse<T>;
      try {
        data = JSON.parse(text);
      } catch {
        throw new AnalysisError('Invalid JSON response', {
          status: 500,
          details: 'Server returned invalid JSON data',
          retryable: true
        });
      }

      if (!data.success || !data.data) {
        throw new AnalysisError('Invalid response format', {
          status: 500,
          details: 'Server returned unsuccessful response',
          retryable: true
        });
      }

      return data.data;
    } catch (error) {
      logger.error('Response handling failed:', error);
      throw error instanceof AnalysisError ? error : AnalysisError.fromError(error);
    }
  }

  private async parseErrorResponse(response: Response): Promise<{
    message?: string;
    details?: string;
    status?: number;
  }> {
    try {
      const data = await response.json();
      return {
        message: data.error?.message,
        details: data.error?.details,
        status: data.error?.status
      };
    } catch {
      return {
        message: `HTTP ${response.status}`,
        details: response.statusText,
        status: response.status
      };
    }
  }
}
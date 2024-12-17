import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import type { ApiConfig } from '../types';

export class ApiClient {
  constructor(private config: ApiConfig) {}

  async analyze(url: string): Promise<any> {
    try {
      logger.info('Starting URL analysis', { url });

      const response = await fetch(`${this.config.baseUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new AnalysisError(
          'Request failed',
          response.status,
          `Server returned status ${response.status}`,
          response.status >= 500
        );
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new AnalysisError(
          ERROR_MESSAGES.VALIDATION.INVALID_CONTENT,
          HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
          `Expected JSON but received: ${contentType}`,
          false
        );
      }

      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new AnalysisError(
          ERROR_MESSAGES.VALIDATION.INVALID_RESPONSE,
          HTTP_STATUS.BAD_GATEWAY,
          'Server returned unsuccessful response',
          true
        );
      }

      return data.data;
    } catch (error) {
      logger.error('API request failed:', error);
      
      if (error instanceof AnalysisError) {
        throw error;
      }

      throw new AnalysisError(
        'Request failed',
        HTTP_STATUS.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}
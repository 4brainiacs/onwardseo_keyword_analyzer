import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { ApiConfig } from '../types';
import type { AnalysisResult } from '../../../types';

export class ApiClient {
  constructor(private config: ApiConfig) {}

  async analyze(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting analysis', { url });

      const response = await fetch(`${this.config.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new AnalysisError(
          'Invalid content type',
          415,
          `Expected JSON but received: ${contentType}`,
          false
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new AnalysisError(
          data.error || 'Request failed',
          response.status,
          data.details || 'Server returned unsuccessful response',
          data.retryable || false
        );
      }

      return data.data;
    } catch (error) {
      logger.error('Analysis request failed:', error);

      if (error instanceof AnalysisError) {
        throw error;
      }

      throw new AnalysisError(
        'Request failed',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}
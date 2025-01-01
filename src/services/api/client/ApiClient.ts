import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { RequestBuilder } from './RequestBuilder';
import { ResponseValidator } from './ResponseValidator';
import { API_CONFIG } from '../config';
import type { AnalysisResult } from '../../../types';

export class ApiClient {
  async analyze(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting analysis request', { url });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

      try {
        const request = RequestBuilder.build(url);
        const response = await fetch(request, {
          signal: controller.signal
        });

        const result = await ResponseValidator.validate<AnalysisResult>(response);
        logger.debug('Analysis completed successfully', { url });
        return result;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      logger.error('Analysis request failed:', error);

      if (error instanceof AnalysisError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new AnalysisError(
          'Request timeout',
          408,
          'The request took too long to complete',
          true
        );
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

export const apiClient = new ApiClient();
import type { ApiClient } from './client';
import type { AnalysisResult } from '../../types';
import { logger } from '../../utils/logger';
import { AnalysisError } from '../errors/AnalysisError';
import { validateAnalysisResult } from '../validation/validator';

export class ApiService {
  constructor(private client: ApiClient) {}

  async analyzeUrl(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting URL analysis', { url });
      
      const response = await this.client.request<AnalysisResult>('/analyze', {
        method: 'POST',
        body: JSON.stringify({ url })
      });

      try {
        validateAnalysisResult(response);
        logger.info('Analysis completed successfully');
        return response;
      } catch (validationError) {
        logger.error('Response validation failed:', validationError);
        throw new AnalysisError(
          'Invalid analysis result',
          500,
          'The server returned an unexpected data format',
          true
        );
      }
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }

      logger.error('Analysis failed:', error);
      throw new AnalysisError(
        'Analysis failed',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}
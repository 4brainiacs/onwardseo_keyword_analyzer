import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import { ApiClient } from './client/ApiClient';
import type { AnalysisResult } from '../../types';

export class ApiService {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient();
  }

  async analyze(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting analysis', { url });
      
      const result = await this.client.analyze(url);
      
      if (!result) {
        throw new AnalysisError({
          message: 'Invalid response',
          status: 500,
          details: 'Server returned empty response',
          retryable: true
        });
      }

      return result;
    } catch (error) {
      logger.error('Analysis failed:', { error });
      
      if (error instanceof AnalysisError) {
        throw error;
      }

      throw new AnalysisError({
        message: 'Analysis failed',
        status: 500,
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        retryable: true
      });
    }
  }
}

export const apiService = new ApiService();
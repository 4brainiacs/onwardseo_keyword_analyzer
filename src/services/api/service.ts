import type { ApiClient } from './client';
import type { AnalysisResult } from '../../types';
import { logger } from '../../utils/logger';

export class ApiService {
  constructor(private client: ApiClient) {}

  async analyzeUrl(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting URL analysis', { url });
      
      return await this.client.request<AnalysisResult>('/analyze', {
        method: 'POST',
        body: JSON.stringify({ url })
      });
    } catch (error) {
      logger.error('Analysis failed:', error);
      throw error;
    }
  }
}
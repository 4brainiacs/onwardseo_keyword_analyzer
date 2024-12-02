import type { ApiClient } from './client';
import type { AnalysisResult } from '../../types';
import { analysisResultSchema } from '../validation/schema';
import { logger } from '../../utils/logger';

export class ApiService {
  constructor(private client: ApiClient) {}

  async analyzeUrl(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting URL analysis', { url });
      
      const response = await this.client.request<AnalysisResult>('/analyze', {
        method: 'POST',
        body: JSON.stringify({ url })
      });

      // Validate response data
      const validatedData = analysisResultSchema.parse(response);
      
      return validatedData;
    } catch (error) {
      logger.error('Analysis failed:', error);
      throw error;
    }
  }
}
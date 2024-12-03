import { apiClient } from './client';
import { logger } from '../../utils/logger';
import { AnalysisError } from '../errors';
import type { AnalysisResult } from '../../types';

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  try {
    logger.info('Starting URL analysis', { url });
    
    const result = await apiClient.request<AnalysisResult>('/.netlify/functions/analyze', {
      method: 'POST',
      body: JSON.stringify({ url }),
      retries: 3,
      timeout: 30000
    });

    return result;
  } catch (error) {
    logger.error('Analysis failed:', error);

    if (error instanceof AnalysisError) {
      throw error;
    }

    throw new AnalysisError(
      'Failed to analyze webpage',
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred',
      true
    );
  }
}

export { apiClient };
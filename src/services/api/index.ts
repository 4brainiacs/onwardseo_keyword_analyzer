import { apiClient } from './client';
import { logger } from '../../utils/logger';
import { AnalysisError } from '../errors';
import type { AnalysisResult } from '../../types';
import { validateAnalysisResult } from '../validation/validator';

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  try {
    logger.info('Starting URL analysis', { url });
    
    const response = await apiClient.request<AnalysisResult>('/analyze', {
      method: 'POST',
      body: JSON.stringify({ url })
    });

    // Validate the response data
    validateAnalysisResult(response);
    
    logger.info('Analysis completed successfully', { url });
    return response;
  } catch (error) {
    logger.error('Analysis failed:', error);

    if (error instanceof AnalysisError) {
      throw error;
    }

    throw new AnalysisError(
      'Analysis failed',
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred',
      true
    );
  }
}

export { apiClient };
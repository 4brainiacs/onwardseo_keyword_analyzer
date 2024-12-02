import { logger } from '../utils/logger';
import { AnalysisError } from './errors';
import { fetchApi } from './api';
import type { AnalysisResult } from '../types';

export async function scrapeWebpage(url: string): Promise<AnalysisResult> {
  try {
    logger.info('Starting webpage analysis', { url });
    
    return await fetchApi<AnalysisResult>('/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });
  } catch (error) {
    logger.error('Analysis failed:', error);

    // Handle specific error cases
    if (error instanceof AnalysisError) {
      throw error;
    }

    // Network or API errors
    if (error instanceof Error && error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new AnalysisError(
        'Network error',
        503,
        'Unable to connect to the analysis service. Please try again.'
      );
    }

    throw new AnalysisError(
      'Failed to analyze webpage',
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}
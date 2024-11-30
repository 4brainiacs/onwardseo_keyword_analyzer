import { logger } from '../utils/logger';
import { AnalysisError } from './errors';
import type { AnalysisResult } from '../types';

export async function scrapeWebpage(url: string): Promise<AnalysisResult> {
  try {
    logger.info('Starting webpage analysis', { url });
    
    const response = await fetch('/.netlify/functions/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new AnalysisError('Invalid response type from server', 500);
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new AnalysisError('Invalid JSON response from server', 500);
    }

    if (!response.ok) {
      throw new AnalysisError(
        data.error || 'Failed to analyze webpage',
        response.status,
        data.details
      );
    }
    
    if (!data?.success || !data?.data) {
      throw new AnalysisError('Invalid response from analysis service', 500);
    }

    logger.info('Analysis successful', {
      wordCount: data.data.totalWords,
      title: data.data.title
    });

    return data.data;
  } catch (error) {
    logger.error('Analysis failed:', error);
    if (error instanceof AnalysisError) {
      throw error;
    }
    throw new AnalysisError(
      'Failed to analyze webpage',
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}
import { decode } from 'html-entities';
import { logger } from '../utils/logger';
import { AnalysisError } from './errors';

export async function scrapeWebpage(url: string): Promise<string> {
  try {
    logger.info('Starting webpage scraping', { url });
    
    const response = await fetch('/.netlify/functions/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new AnalysisError(
        error.error || 'Failed to scrape webpage',
        response.status,
        error.details
      );
    }

    const data = await response.json();
    
    if (!data?.success || !data?.data) {
      throw new AnalysisError('Invalid response from analysis service', 500);
    }

    logger.info('Analysis successful');
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
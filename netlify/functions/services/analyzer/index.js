import { contentAnalyzer } from './contentAnalyzer';
import { logger } from '../utils/logger';
import { AnalysisError } from '../errors/AnalysisError';

export async function analyzeContent(url) {
  try {
    logger.info('Starting content analysis', { url });
    return await contentAnalyzer.analyze(url);
  } catch (error) {
    logger.error('Analysis failed:', error);
    throw error instanceof AnalysisError ? error : new AnalysisError(
      'Analysis failed',
      500,
      error.message,
      true
    );
  }
}

export { contentAnalyzer };
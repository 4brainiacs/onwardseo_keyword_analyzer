import { analyzeContent } from '../../../../src/services/analyzer';
import { logger } from '../../../../src/utils/logger';
import type { AnalysisResult } from '../../../../src/types';

export class AnalyzerService {
  static async analyze(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting content analysis', { url });
      return await analyzeContent(url);
    } catch (error) {
      logger.error('Analysis failed:', error);
      throw error;
    }
  }
}
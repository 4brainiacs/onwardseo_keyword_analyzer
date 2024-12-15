import { ContentAnalyzer } from './ContentAnalyzer';
import { KeywordAnalyzer } from './analyzers/KeywordAnalyzer';
import { HeadingAnalyzer } from './analyzers/HeadingAnalyzer';
import { MetadataAnalyzer } from './analyzers/MetadataAnalyzer';
import { TextProcessor } from './processors/TextProcessor';
import { logger } from '../../utils/logger';
import type { AnalysisResult } from '../../types';

export async function analyzeContent(html: string): Promise<AnalysisResult> {
  try {
    logger.info('Starting content analysis');
    
    const analyzer = new ContentAnalyzer({
      keywordAnalyzer: new KeywordAnalyzer(),
      headingAnalyzer: new HeadingAnalyzer(),
      metadataAnalyzer: new MetadataAnalyzer(),
      textProcessor: new TextProcessor()
    });

    return await analyzer.analyze(html);
  } catch (error) {
    logger.error('Analysis failed:', error);
    throw error;
  }
}

export { ContentAnalyzer };
export type { AnalysisResult };
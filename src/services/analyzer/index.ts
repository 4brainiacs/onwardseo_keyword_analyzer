import { ContentAnalyzer } from './ContentAnalyzer';
import { KeywordAnalyzer } from './analyzers/KeywordAnalyzer';
import { HeadingAnalyzer } from './analyzers/HeadingAnalyzer';
import { MetadataAnalyzer } from './analyzers/MetadataAnalyzer';
import { TextAnalyzer } from './analyzers/TextAnalyzer';
import { logger } from '../../utils/logger';
import type { AnalysisResult } from '../../types';

export async function analyzeContent(url: string): Promise<AnalysisResult> {
  try {
    logger.info('Starting content analysis', { url });
    
    const analyzer = new ContentAnalyzer({
      keywordAnalyzer: new KeywordAnalyzer(),
      headingAnalyzer: new HeadingAnalyzer(),
      metadataAnalyzer: new MetadataAnalyzer(),
      textAnalyzer: new TextAnalyzer()
    });

    return await analyzer.analyze(url);
  } catch (error) {
    logger.error('Analysis failed:', error);
    throw error;
  }
}

export { ContentAnalyzer, KeywordAnalyzer, HeadingAnalyzer, MetadataAnalyzer, TextAnalyzer };
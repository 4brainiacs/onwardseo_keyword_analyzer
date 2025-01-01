import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { AnalysisResult } from '../../../types';

interface Dependencies {
  keywordAnalyzer: any;
  headingAnalyzer: any;
  metadataAnalyzer: any;
  textProcessor: any;
}

export class ContentAnalyzer {
  constructor(private deps: Dependencies) {}

  async analyze(html: string): Promise<AnalysisResult> {
    try {
      const { cleanText, words } = this.deps.textProcessor.process(html);
      const metadata = this.deps.metadataAnalyzer.extract(html);
      const headings = this.deps.headingAnalyzer.extract(html);
      
      const keywords = this.deps.keywordAnalyzer.analyze(words, {
        title: metadata.title,
        headings,
        metaDescription: metadata.metaDescription
      });

      return {
        ...metadata,
        headings,
        totalWords: words.length,
        ...keywords,
        scrapedContent: cleanText
      };
    } catch (error) {
      logger.error('Content analysis failed:', error);
      throw new AnalysisError(
        'Failed to analyze content',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}
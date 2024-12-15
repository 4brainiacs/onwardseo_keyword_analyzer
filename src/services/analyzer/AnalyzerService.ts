import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import { ContentProcessor } from './processors/ContentProcessor';
import { KeywordAnalyzer } from './analyzers/KeywordAnalyzer';
import { HeadingExtractor } from './extractors/HeadingExtractor';
import type { AnalysisResult } from '../../types';

export class AnalyzerService {
  private contentProcessor: ContentProcessor;
  private keywordAnalyzer: KeywordAnalyzer;
  private headingExtractor: HeadingExtractor;

  constructor() {
    this.contentProcessor = new ContentProcessor();
    this.keywordAnalyzer = new KeywordAnalyzer();
    this.headingExtractor = new HeadingExtractor();
  }

  analyze(html: string): AnalysisResult {
    try {
      logger.info('Starting content analysis');

      const { cleanText, words } = this.contentProcessor.process(html);
      const headings = this.headingExtractor.extract(html);
      const { title, metaDescription } = headings;

      const phrases = this.keywordAnalyzer.analyze(words, {
        title,
        headings: headings.headings,
        metaDescription
      });

      return {
        title,
        metaDescription,
        headings: headings.headings,
        totalWords: words.length,
        ...phrases,
        scrapedContent: cleanText
      };
    } catch (error) {
      logger.error('Analysis failed:', error);
      throw error instanceof AnalysisError ? error : new AnalysisError(
        'Analysis failed',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}
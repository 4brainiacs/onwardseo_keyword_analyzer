import { logger } from '../../utils/logger';
import { ContentAnalyzer } from './analyzers/ContentAnalyzer';
import { HeadingAnalyzer } from './analyzers/HeadingAnalyzer';
import { KeywordAnalyzer } from './analyzers/KeywordAnalyzer';
import { MetadataAnalyzer } from './analyzers/MetadataAnalyzer';
import { TextProcessor } from './processors/TextProcessor';
import type { AnalysisResult } from '../../types';

export class AnalysisService {
  private contentAnalyzer: ContentAnalyzer;
  private headingAnalyzer: HeadingAnalyzer;
  private keywordAnalyzer: KeywordAnalyzer;
  private metadataAnalyzer: MetadataAnalyzer;
  private textProcessor: TextProcessor;

  constructor() {
    this.contentAnalyzer = new ContentAnalyzer();
    this.headingAnalyzer = new HeadingAnalyzer();
    this.keywordAnalyzer = new KeywordAnalyzer();
    this.metadataAnalyzer = new MetadataAnalyzer();
    this.textProcessor = new TextProcessor();
  }

  async analyze(html: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting content analysis');

      const { cleanText, words } = this.textProcessor.process(html);
      const metadata = this.metadataAnalyzer.extract(html);
      const headings = this.headingAnalyzer.extract(html);
      const keywords = this.keywordAnalyzer.analyze(words, {
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
      logger.error('Analysis failed:', error);
      throw error;
    }
  }
}
import { load } from 'cheerio';
import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import type { AnalysisResult } from '../../types';
import type { 
  KeywordAnalyzer,
  HeadingAnalyzer,
  MetadataAnalyzer,
  TextProcessor 
} from './analyzers';

interface ContentAnalyzerDeps {
  keywordAnalyzer: KeywordAnalyzer;
  headingAnalyzer: HeadingAnalyzer;
  metadataAnalyzer: MetadataAnalyzer;
  textProcessor: TextProcessor;
}

export class ContentAnalyzer {
  constructor(private deps: ContentAnalyzerDeps) {}

  async analyze(html: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting content analysis');

      const $ = load(html, {
        decodeEntities: true,
        normalizeWhitespace: true
      });

      // Extract metadata first
      const { title, metaDescription } = this.deps.metadataAnalyzer.extract($);
      
      // Extract headings
      const headings = this.deps.headingAnalyzer.extract($);

      // Process text content
      const { cleanText, words } = this.deps.textProcessor.process($);

      // Analyze keywords
      const { 
        twoWordPhrases,
        threeWordPhrases,
        fourWordPhrases 
      } = this.deps.keywordAnalyzer.analyze(words, {
        title,
        headings,
        metaDescription
      });

      return {
        title,
        metaDescription,
        headings,
        totalWords: words.length,
        twoWordPhrases,
        threeWordPhrases,
        fourWordPhrases,
        scrapedContent: cleanText
      };
    } catch (error) {
      logger.error('Content analysis failed:', error);
      throw error instanceof AnalysisError ? error : new AnalysisError(
        'Analysis failed',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}
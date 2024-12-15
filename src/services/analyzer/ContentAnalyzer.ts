import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import { scrapingService } from '../scraping/scrapingService';
import type { AnalysisResult } from '../../types';
import type { 
  KeywordAnalyzer,
  HeadingAnalyzer,
  MetadataAnalyzer,
  TextAnalyzer 
} from './analyzers';

interface ContentAnalyzerDeps {
  keywordAnalyzer: KeywordAnalyzer;
  headingAnalyzer: HeadingAnalyzer;
  metadataAnalyzer: MetadataAnalyzer;
  textAnalyzer: TextAnalyzer;
}

export class ContentAnalyzer {
  constructor(private deps: ContentAnalyzerDeps) {}

  async analyze(url: string): Promise<AnalysisResult> {
    try {
      const html = await scrapingService.scrapeWebpage(url);
      
      if (!html) {
        throw new AnalysisError(
          'Empty response',
          500,
          'No content received from webpage',
          true
        );
      }

      const { cleanText, metadata } = this.deps.textAnalyzer.process(html);
      logger.debug('Text processing complete', metadata);

      const { title, metaDescription } = this.deps.metadataAnalyzer.extract(html);
      const headings = this.deps.headingAnalyzer.extract(html);
      const words = cleanText.toLowerCase().split(/\s+/).filter(Boolean);

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
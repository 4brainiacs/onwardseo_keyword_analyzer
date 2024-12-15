import * as cheerio from 'cheerio';
import { logger } from '../utils/logger';
import { AnalysisError } from '../errors/AnalysisError';
import { scrapeContent } from './scraper';
import { validateContent } from './validators/contentValidator';
import { extractMetadata } from './extractors/metadataExtractor';
import { extractHeadings } from './extractors/headingExtractor';
import { processText } from './processors/textProcessor';
import { analyzePhrases } from './processors/phraseProcessor';

export class ContentAnalyzer {
  async analyze(url) {
    try {
      // Step 1: Scrape content
      logger.debug('Starting content scraping', { url });
      const html = await scrapeContent(url);

      // Step 2: Validate content
      logger.debug('Validating content');
      validateContent(html);

      // Step 3: Parse HTML
      logger.debug('Parsing HTML');
      const $ = cheerio.load(html, {
        decodeEntities: true,
        normalizeWhitespace: true
      });

      // Step 4: Clean content
      $('script, style, noscript, iframe, svg, nav, header, footer').remove();
      $('.navigation, .menu, .footer, .header, .sidebar').remove();

      // Step 5: Extract data
      const metadata = extractMetadata($);
      const headings = extractHeadings($);
      const { cleanText, words, totalWords } = processText($('body').text());

      if (totalWords === 0) {
        throw new AnalysisError(
          'No analyzable content',
          400,
          'The webpage contains no meaningful text content',
          false
        );
      }

      // Step 6: Analyze phrases
      const phrases = analyzePhrases(words, {
        title: metadata.title,
        headings
      });

      // Step 7: Build result
      const result = {
        ...metadata,
        headings,
        totalWords,
        ...phrases,
        scrapedContent: cleanText.slice(0, 5000)
      };

      logger.info('Analysis completed successfully', {
        url,
        wordCount: totalWords,
        hasContent: cleanText.length > 0
      });

      return result;

    } catch (error) {
      logger.error('Content analysis failed:', {
        error,
        url,
        stack: error.stack
      });

      if (error instanceof AnalysisError) {
        throw error;
      }

      throw new AnalysisError(
        'Analysis failed',
        500,
        error.message || 'An unexpected error occurred',
        true
      );
    }
  }
}

export const contentAnalyzer = new ContentAnalyzer();
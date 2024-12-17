import { CheerioAPI, load } from 'cheerio';
import { AnalysisError } from '../errors/AnalysisError';
import { logger } from '../../utils/logger';
import type { AnalysisResult, PageHeadings } from '../../types';

export class ContentAnalyzer {
  analyze(html: string): AnalysisResult {
    try {
      const $ = load(html);

      // Remove unwanted elements
      $('script, style, noscript, iframe, svg').remove();

      const title = $('title').text().trim();
      const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
      const headings = this.extractHeadings($);
      const cleanText = this.cleanText($('body').text());

      return {
        title,
        metaDescription,
        headings,
        totalWords: cleanText.split(/\s+/).length,
        twoWordPhrases: [],
        threeWordPhrases: [],
        fourWordPhrases: [],
        scrapedContent: cleanText
      };
    } catch (error) {
      logger.error('Content analysis failed:', { error });
      throw new AnalysisError({
        message: 'Failed to analyze content',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private extractHeadings($: CheerioAPI): PageHeadings {
    return {
      h1: $('h1').map((_, el) => $(el).text().trim()).get(),
      h2: $('h2').map((_, el) => $(el).text().trim()).get(),
      h3: $('h3').map((_, el) => $(el).text().trim()).get(),
      h4: $('h4').map((_, el) => $(el).text().trim()).get()
    };
  }

  private cleanText(text: string): string {
    return text
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
import { load } from 'cheerio';
import { logger } from '../../../utils/logger';
import { CONTENT_FILTERS } from '../../../utils/contentFilters';

export class ContentAnalyzer {
  analyze(html: string): string {
    try {
      const $ = load(html);
      
      // Remove unwanted elements
      CONTENT_FILTERS.excludeTags.forEach(selector => {
        $(selector).remove();
      });

      // Clean text content
      const text = $('body').text();
      return this.cleanText(text);
    } catch (error) {
      logger.error('Content analysis failed:', error);
      throw error;
    }
  }

  private cleanText(text: string): string {
    return text
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
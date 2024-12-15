import { load } from 'cheerio';
import { logger } from '../../../utils/logger';
import { CONTENT_FILTERS } from '../../../utils/contentFilters';

export class TextAnalyzer {
  process(html: string) {
    try {
      const $ = load(html);

      // Remove unwanted elements
      $('script, style, noscript, iframe, svg, nav, header, footer').remove();
      $('.navigation, .menu, .footer, .header, .sidebar').remove();

      // Get text content
      let text = $('body').text();

      // Apply content filters
      CONTENT_FILTERS.forEach(pattern => {
        text = text.replace(pattern, ' ');
      });

      // Clean up text
      const cleanText = text
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        cleanText,
        metadata: {
          originalLength: html.length,
          cleanedLength: cleanText.length,
          processingTime: Date.now()
        }
      };
    } catch (error) {
      logger.error('Text processing failed:', error);
      throw error;
    }
  }
}
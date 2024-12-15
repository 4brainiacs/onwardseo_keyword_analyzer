import { logger } from '../../../utils/logger';
import { CONTENT_FILTERS } from '../../../utils/contentFilters';
import type { ContentPatterns } from '../../../utils/contentFilters';

export class TextAnalyzer {
  process(html: string) {
    try {
      let text = html;

      // Apply content filters
      Object.entries(CONTENT_FILTERS.patterns).forEach(([_, patterns]: [string, RegExp[]]) => {
        patterns.forEach((pattern: RegExp) => {
          text = text.replace(pattern, ' ');
        });
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
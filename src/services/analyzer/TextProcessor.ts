import { CONTENT_FILTERS } from '../../utils/contentFilters';
import { logger } from '../../utils/logger';

export class TextProcessor {
  process(html: string): {
    cleanText: string;
    metadata: {
      originalLength: number;
      cleanedLength: number;
      processingTime: number;
    };
  } {
    const startTime = performance.now();

    try {
      let cleanText = html;
      
      // Apply each filter pattern
      Object.entries(CONTENT_FILTERS.patterns).forEach(([_, patterns]) => {
        (patterns as RegExp[]).forEach(pattern => {
          cleanText = cleanText.replace(pattern, ' ');
        });
      });

      // Normalize whitespace
      cleanText = cleanText
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const endTime = performance.now();

      return {
        cleanText,
        metadata: {
          originalLength: html.length,
          cleanedLength: cleanText.length,
          processingTime: endTime - startTime
        }
      };
    } catch (error) {
      logger.error('Text processing failed:', { error });
      throw error;
    }
  }
}
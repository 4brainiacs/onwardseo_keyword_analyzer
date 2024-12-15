import { logger } from '../../utils/logger';
import { CONTENT_FILTERS } from '../../utils/contentFilters';

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
      // Remove unwanted HTML elements
      let cleanText = html.replace(/<(script|style|iframe|svg)[^>]*>[\s\S]*?<\/\1>/gi, ' ');
      cleanText = cleanText.replace(/<[^>]+>/g, ' ');

      // Apply content filters
      CONTENT_FILTERS.forEach(pattern => {
        cleanText = cleanText.replace(pattern, ' ');
      });

      // Clean up whitespace
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
      logger.error('Text processing failed:', error);
      throw error;
    }
  }
}
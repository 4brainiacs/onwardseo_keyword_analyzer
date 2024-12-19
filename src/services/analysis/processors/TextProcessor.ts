import { logger } from '../../../utils/logger';
import { CONTENT_FILTERS } from '../../../utils/contentFilters';

export class TextProcessor {
  process(text: string): { cleanText: string; words: string[] } {
    try {
      const cleanText = this.applyFilters(text);
      const words = this.extractWords(cleanText);

      return {
        cleanText,
        words
      };
    } catch (error) {
      logger.error('Text processing failed:', error);
      throw error;
    }
  }

  private applyFilters(text: string): string {
    let cleaned = text;
    
    Object.values(CONTENT_FILTERS.patterns).forEach(patterns => {
      patterns.forEach(pattern => {
        cleaned = cleaned.replace(pattern, ' ');
      });
    });

    return cleaned
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => 
        word.length >= 3 && 
        !/^\d+$/.test(word) &&
        !/^[^a-z]+$/.test(word)
      );
  }
}
import type { CheerioAPI } from 'cheerio';
import { logger } from '../../../utils/logger';
import { CONTENT_FILTERS } from '../filters/ContentFilters';

interface ProcessedText {
  cleanText: string;
  words: string[];
  metadata: {
    originalLength: number;
    cleanedLength: number;
    processingTime: number;
  };
}

export class TextProcessor {
  process($: CheerioAPI): ProcessedText {
    const startTime = performance.now();

    try {
      // Remove unwanted elements first
      this.removeUnwantedElements($);

      // Get and clean text content
      const rawText = $('body').text();
      const cleanText = this.cleanText(rawText);
      const words = this.extractWords(cleanText);

      const endTime = performance.now();

      return {
        cleanText,
        words,
        metadata: {
          originalLength: rawText.length,
          cleanedLength: cleanText.length,
          processingTime: endTime - startTime
        }
      };
    } catch (error) {
      logger.error('Text processing failed:', error);
      throw error;
    }
  }

  private removeUnwantedElements($: CheerioAPI): void {
    CONTENT_FILTERS.excludeTags.forEach(selector => {
      $(selector).remove();
    });
  }

  private cleanText(text: string): string {
    let cleaned = text;

    // Apply content filters
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
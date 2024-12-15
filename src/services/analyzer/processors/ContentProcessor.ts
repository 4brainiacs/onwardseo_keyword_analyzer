import { CONTENT_FILTERS } from '../filters/ContentFilters';
import { logger } from '../../../utils/logger';

export class ContentProcessor {
  process(html: string): { cleanText: string; words: string[] } {
    try {
      let cleanText = this.removeUnwantedElements(html);
      cleanText = this.applyContentFilters(cleanText);
      cleanText = this.normalizeText(cleanText);

      const words = this.extractWords(cleanText);

      return { cleanText, words };
    } catch (error) {
      logger.error('Content processing failed:', error);
      throw error;
    }
  }

  private removeUnwantedElements(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    CONTENT_FILTERS.excludeTags.forEach(selector => {
      doc.querySelectorAll(selector).forEach(el => el.remove());
    });

    return doc.body.textContent || '';
  }

  private applyContentFilters(text: string): string {
    let filtered = text;

    Object.values(CONTENT_FILTERS.patterns).forEach(patterns => {
      patterns.forEach(pattern => {
        filtered = filtered.replace(pattern, ' ');
      });
    });

    return filtered;
  }

  private normalizeText(text: string): string {
    return text
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2);
  }
}
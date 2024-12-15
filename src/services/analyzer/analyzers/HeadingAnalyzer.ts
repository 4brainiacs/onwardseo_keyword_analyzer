import type { CheerioAPI } from 'cheerio';
import { logger } from '../../../utils/logger';
import type { PageHeadings } from '../../../types';

export class HeadingAnalyzer {
  extract($: CheerioAPI): PageHeadings {
    try {
      return {
        h1: this.extractHeadingsByTag($, 'h1'),
        h2: this.extractHeadingsByTag($, 'h2'),
        h3: this.extractHeadingsByTag($, 'h3'),
        h4: this.extractHeadingsByTag($, 'h4')
      };
    } catch (error) {
      logger.error('Heading extraction failed:', error);
      return { h1: [], h2: [], h3: [], h4: [] };
    }
  }

  private extractHeadingsByTag($: CheerioAPI, tag: string): string[] {
    try {
      return $(tag)
        .map((_, element): string => $(element).text().trim())
        .get()
        .filter((text): text is string => Boolean(text));
    } catch (error) {
      logger.error(`Failed to extract ${tag} headings:`, error);
      return [];
    }
  }
}
import { load } from 'cheerio';
import { logger } from '../../../utils/logger';
import type { PageHeadings } from '../../../types';

export class HeadingAnalyzer {
  extract(html: string): PageHeadings {
    try {
      const $ = load(html);

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

  private extractHeadingsByTag($: cheerio.Root, tag: string): string[] {
    return $(tag)
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(text => text.length > 0);
  }
}
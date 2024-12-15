import type { CheerioAPI, Element } from 'cheerio';
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
      logger.error('Heading extraction failed:', { error });
      return { h1: [], h2: [], h3: [], h4: [] };
    }
  }

  private extractHeadingsByTag($: CheerioAPI, tag: string): string[] {
    return $(tag)
      .map((index: number, element: Element): string => $(element).text().trim())
      .get()
      .filter((text: string): boolean => text.length > 0);
  }
}
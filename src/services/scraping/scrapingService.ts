import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import type { ContentValidator } from './validators/ContentValidator';
import type { ScrapingConfig } from './types';

export class ScrapingService {
  constructor(private deps: { contentValidator: ContentValidator }) {}

  async scrapeWebpage(url: string): Promise<string> {
    try {
      logger.info('Starting webpage scraping', { url });

      const response = await fetch(url, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new AnalysisError(
          'Failed to fetch webpage',
          response.status,
          `Server returned status ${response.status}`,
          response.status >= 500
        );
      }

      const html = await response.text();
      this.deps.contentValidator.validateContent(html);
      
      return html;
    } catch (error) {
      logger.error('Scraping failed:', { error, url });
      throw error instanceof AnalysisError ? error : new AnalysisError(
        'Failed to scrape webpage',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}
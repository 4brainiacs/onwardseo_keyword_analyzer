import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import { RetryService } from '../retry/RetryService';
import type { RequestBuilder } from './request/RequestBuilder';
import type { ResponseValidator } from './response/ResponseValidator';
import type { ContentValidator } from './validators/ContentValidator';

interface ScrapingServiceDeps {
  requestBuilder: RequestBuilder;
  responseValidator: ResponseValidator;
  contentValidator: ContentValidator;
}

export class ScrapingService {
  private retryService: RetryService;

  constructor(private deps: ScrapingServiceDeps) {
    this.retryService = new RetryService({
      maxAttempts: 3,
      initialDelay: 2000,
      maxDelay: 10000
    });
  }

  async scrapeWebpage(url: string): Promise<string> {
    return this.retryService.execute(async () => {
      try {
        logger.info('Starting webpage scraping', { url });

        const request = this.deps.requestBuilder.buildRequest(url);
        const response = await fetch(request);

        await this.deps.responseValidator.validateResponse(response);
        const html = await response.text();
        
        this.deps.contentValidator.validateContent(html);
        return html;

      } catch (error) {
        logger.error('Scraping failed:', { error, url });
        
        if (error instanceof AnalysisError) {
          throw error;
        }

        throw new AnalysisError(
          'Failed to scrape webpage',
          500,
          error instanceof Error ? error.message : 'An unexpected error occurred',
          true
        );
      }
    }, 'scraping');
  }
}
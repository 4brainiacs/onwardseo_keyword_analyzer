import { logger } from '../../utils/logger';
import { ScrapingConfig, ScrapingResponse, ScrapingError, ScrapingBeeResponse } from './types';
import { RetryService } from '../retry/RetryService';
import { validateUrl } from '../../utils/urlValidator';
import { RequestBuilder } from './requestBuilder';
import { ResponseValidator } from './validators/responseValidator';
import { ErrorHandler } from './errorHandler';
import { environment } from '../../config/environment';

export class ScrapingService {
  private config: ScrapingConfig;
  private retryService: RetryService;
  private requestBuilder: RequestBuilder;
  private responseValidator: ResponseValidator;
  private errorHandler: ErrorHandler;

  constructor() {
    this.config = {
      timeout: 30000,
      maxRetries: 3,
      retryDelay: 2000,
      maxContentSize: 10 * 1024 * 1024,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    };

    this.retryService = new RetryService({
      maxAttempts: this.config.maxRetries,
      initialDelay: this.config.retryDelay
    });

    this.requestBuilder = new RequestBuilder(this.config);
    this.responseValidator = new ResponseValidator(this.config.maxContentSize);
    this.errorHandler = new ErrorHandler();
  }

  async scrapeWebpage(url: string): Promise<string> {
    try {
      const urlValidation = validateUrl(url);
      if (!urlValidation.isValid) {
        throw new ScrapingError(urlValidation.error || 'Invalid URL', 400, false);
      }

      logger.info('Starting webpage scraping', { url });

      const params = new URLSearchParams({
        api_key: environment.scrapingBee.apiKey,
        url: url,
        render_js: 'false',
        premium_proxy: 'true',
        block_ads: 'true',
        block_resources: 'true',
        country_code: 'us'
      });

      const response = await fetch(`${environment.scrapingBee.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: this.config.headers
      });

      if (!response.ok) {
        throw new ScrapingError(
          'Failed to fetch webpage',
          response.status,
          response.status >= 500
        );
      }

      const text = await response.text();
      
      if (!text || !text.trim()) {
        throw new ScrapingError('Empty response received', 400, false);
      }

      return text;
    } catch (error) {
      logger.error('Scraping failed', { error, url });
      throw this.errorHandler.handleError(error);
    }
  }

  private isValidHtml(content: string): boolean {
    const cleaned = content.toLowerCase().trim();
    return cleaned.includes('<html') || 
           cleaned.includes('<!doctype html') || 
           (cleaned.includes('<body') && cleaned.includes('</body>'));
  }
}

export const scrapingService = new ScrapingService();
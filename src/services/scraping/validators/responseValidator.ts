import { ScrapingError, ScrapingBeeResponse } from '../types';
import { logger } from '../../../utils/logger';
import { HeaderValidator } from './headerValidator';
import { ContentValidator } from './contentValidator';
import { HtmlValidator } from './htmlValidator';

export class ResponseValidator {
  private headerValidator: HeaderValidator;
  private contentValidator: ContentValidator;
  private htmlValidator: HtmlValidator;

  constructor(maxContentSize: number) {
    this.headerValidator = new HeaderValidator();
    this.contentValidator = new ContentValidator(maxContentSize);
    this.htmlValidator = new HtmlValidator();
  }

  async validate(response: Response): Promise<void> {
    try {
      this.headerValidator.validateStatusCode(response.status);
      this.headerValidator.validateContentType(response.headers.get('content-type'));
      this.contentValidator.validateSize(parseInt(response.headers.get('content-length') || '0'));
      await this.validateResponseBody(response.clone());
    } catch (error) {
      logger.error('Response validation failed:', error);
      throw error;
    }
  }

  private async validateResponseBody(response: Response): Promise<void> {
    let text: string;
    try {
      text = await response.text();
      this.contentValidator.validateContent(text);

      if (this.htmlValidator.isValidHtml(text)) {
        return;
      }

      // Try parsing as JSON
      const json = JSON.parse(text) as ScrapingBeeResponse;
      
      if (json.error || json.message) {
        throw new ScrapingError(
          json.error || json.message || 'ScrapingBee error',
          400,
          false
        );
      }

      if (json.body && typeof json.body === 'string') {
        if (!this.htmlValidator.isValidHtml(json.body)) {
          throw new ScrapingError('Invalid HTML content received', 400, false);
        }
        return;
      }

      throw new ScrapingError('No valid HTML content in response', 400, false);
    } catch (error) {
      if (error instanceof ScrapingError) throw error;
      throw new ScrapingError(
        'Invalid response format',
        400,
        false,
        error instanceof Error ? error.message : undefined
      );
    }
  }
}
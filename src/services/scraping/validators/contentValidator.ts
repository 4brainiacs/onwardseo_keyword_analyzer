import { ScrapingError } from '../types';

export class ContentValidator {
  constructor(private maxContentSize: number) {}

  validateSize(contentLength: number): void {
    if (contentLength > this.maxContentSize) {
      throw new ScrapingError(
        'Response too large',
        413,
        false,
        `Maximum allowed size is ${Math.round(this.maxContentSize / 1024 / 1024)}MB`
      );
    }
  }

  validateContent(text: string | null): void {
    if (!text || !text.trim()) {
      throw new ScrapingError('Empty response received', 400, false);
    }
  }
}
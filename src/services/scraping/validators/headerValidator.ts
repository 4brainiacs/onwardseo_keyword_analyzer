import { ScrapingError } from '../types';

export class HeaderValidator {
  validateContentType(contentType: string | null): void {
    if (!contentType) {
      return; // ScrapingBee sometimes doesn't set content-type header
    }

    const normalizedType = contentType.toLowerCase();
    if (!normalizedType.includes('application/json') && !normalizedType.includes('text/html')) {
      throw new ScrapingError('Invalid response type from ScrapingBee', 400, false);
    }
  }

  validateStatusCode(status: number): void {
    if (status === 401) {
      throw new ScrapingError('Invalid API key', 401, false);
    }

    if (status === 429) {
      throw new ScrapingError('Rate limit exceeded', 429, true);
    }

    if (status !== 200) {
      throw new ScrapingError(
        `HTTP Error ${status}`,
        status,
        status >= 500
      );
    }
  }
}
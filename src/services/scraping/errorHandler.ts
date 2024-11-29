import { ScrapingError } from './types';
import { logger } from '../../utils/logger';

export class ErrorHandler {
  handleError(error: any): Error {
    logger.error('Scraping error:', error);

    if (error instanceof ScrapingError) {
      const message = this.getErrorMessage(error);
      return new Error(message);
    }

    if (error.name === 'AbortError') {
      return new Error('Request timed out. Please try again.');
    }

    if (error.message?.includes('Failed to fetch')) {
      return new Error('Network error. Please check your connection.');
    }

    if (error.message?.includes('Invalid URL')) {
      return new Error('Please enter a valid website URL.');
    }

    if (error.message?.includes('blocked')) {
      return new Error('This website is blocking automated access. Please try another URL.');
    }

    return new Error('Failed to analyze webpage. Please try again.');
  }

  private getErrorMessage(error: ScrapingError): string {
    const baseMessage = error.message;
    const details = error.details ? ` (${error.details})` : '';

    switch (error.statusCode) {
      case 400:
        if (baseMessage.includes('blocked') || baseMessage.includes('access denied')) {
          return 'This website is blocking automated access. Please try another URL.';
        }
        return `Unable to access webpage${details}`;
      case 401:
        return 'Invalid API credentials';
      case 403:
        return 'Access denied by the website. Please try another URL.';
      case 404:
        return 'Page not found. Please check the URL and try again.';
      case 429:
        return 'Too many requests. Please try again in a few minutes.';
      case 413:
        return `Page too large to process${details}`;
      case 500:
      case 502:
      case 503:
      case 504:
        return 'The website is temporarily unavailable. Please try again later.';
      default:
        return `${baseMessage}${details}`;
    }
  }
}
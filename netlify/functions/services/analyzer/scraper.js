import axios from 'axios';
import { logger } from '../utils/logger';
import { AnalysisError } from '../errors/AnalysisError';
import { validateResponse } from './validators/responseValidator';

export async function scrapeContent(url) {
  try {
    logger.info('Starting webpage scraping', { url });

    const response = await axios({
      method: 'GET',
      url,
      timeout: 30000,
      maxContentLength: 10 * 1024 * 1024,
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      validateStatus: null
    });

    // Validate response
    validateResponse(response);

    const html = response.data;
    if (!html || typeof html !== 'string') {
      throw new AnalysisError(
        'Invalid response',
        500,
        'Server returned non-text content',
        true
      );
    }

    logger.debug('Scraping successful', {
      contentLength: html.length,
      contentType: response.headers['content-type']
    });

    return html;

  } catch (error) {
    logger.error('Scraping failed:', {
      error,
      url,
      status: error.response?.status,
      statusText: error.response?.statusText
    });

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new AnalysisError(
          'Request timeout',
          408,
          'The website took too long to respond',
          true
        );
      }

      if (!error.response) {
        throw new AnalysisError(
          'Network error',
          503,
          'Could not connect to the website',
          true
        );
      }

      throw new AnalysisError(
        'Failed to fetch webpage',
        error.response.status,
        error.response.statusText,
        error.response.status >= 500
      );
    }

    if (error instanceof AnalysisError) {
      throw error;
    }

    throw new AnalysisError(
      'Scraping failed',
      500,
      error.message || 'An unexpected error occurred',
      true
    );
  }
}
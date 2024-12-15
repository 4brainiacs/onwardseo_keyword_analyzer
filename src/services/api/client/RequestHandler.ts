import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export class RequestHandler {
  async sendRequest(url: string, config: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      logger.debug('Making request:', { url, method: config.method });

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...config.headers
        }
      });

      logger.debug('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      return response;
    } catch (error) {
      logger.error('Request failed:', { error, url });
      
      if (error.name === 'AbortError') {
        throw new AnalysisError(
          'Request timeout',
          408,
          'The request took too long to complete',
          true
        );
      }

      throw new AnalysisError(
        'Request failed',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { ApiConfig } from '../types';

export class RequestHandler {
  constructor(private config: ApiConfig) {}

  async sendRequest(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      logger.debug('Making request', { url, method: options.method });

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new AnalysisError(
          'Request failed',
          response.status,
          `Server returned status ${response.status}`,
          response.status >= 500
        );
      }

      return response;
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new AnalysisError(
          'Request timeout',
          408,
          'The request took too long to complete',
          true
        );
      }

      throw new AnalysisError(
        'Network error',
        503,
        error instanceof Error ? error.message : 'Failed to connect to server',
        true
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
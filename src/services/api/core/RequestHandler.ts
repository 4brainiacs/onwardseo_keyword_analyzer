import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { validateResponse } from '../validators/responseValidator';
import type { RequestConfig } from '../types';

export class RequestHandler {
  async sendRequest<T>(url: string, config: RequestConfig): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort('Request timeout'),
      config.timeout || 30000
    );

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

      // Read response text immediately to avoid timing issues
      const text = await response.text();
      
      logger.debug('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        bodyPreview: text.slice(0, 200)
      });

      return await validateResponse(response, text);
    } catch (error) {
      logger.error('Request failed:', { error, url });
      
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
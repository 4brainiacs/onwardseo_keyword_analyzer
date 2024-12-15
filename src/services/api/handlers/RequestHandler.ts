import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS } from '../constants';
import type { RequestConfig } from '../types';

export class RequestHandler {
  async sendRequest(url: string, config: RequestConfig): Promise<Response> {
    const controller = new AbortController();
    const timeout = config.timeout || API_CONSTANTS.TIMEOUTS.DEFAULT;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      logger.debug('Making request', {
        url,
        method: config.method,
        timeout
      });

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
        headers: {
          ...API_CONSTANTS.HEADERS,
          ...config.headers,
          [API_CONSTANTS.HEADERS.REQUEST_ID]: crypto.randomUUID()
        }
      });

      if (!response.ok) {
        const status = response.status;
        throw new AnalysisError({
          message: `HTTP ${status}`,
          status,
          details: response.statusText || `Server returned status ${status}`,
          retryable: status >= 500 || status === 429,
          retryAfter: status === 429 ? 
            Number(response.headers.get(API_CONSTANTS.HEADERS.RETRY_AFTER)) * 1000 : 
            undefined
        });
      }

      return response;
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new AnalysisError({
          message: API_CONSTANTS.NETWORK.TIMEOUT,
          status: 408,
          details: `Request timed out after ${timeout}ms`,
          retryable: true
        });
      }

      throw new AnalysisError({
        message: API_CONSTANTS.NETWORK.CONNECTION,
        status: 503,
        details: error instanceof Error ? error.message : 'Failed to connect to server',
        retryable: true
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
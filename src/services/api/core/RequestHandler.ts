import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import type { RequestConfig } from '../types';

export class RequestHandler {
  async sendRequest(url: string, config: RequestConfig): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || 30000);

    try {
      logger.debug('Making request', { url, method: config.method });

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...config.headers
        }
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

      if (error instanceof Error && error.name === 'AbortError') {
        throw new AnalysisError(
          ERROR_MESSAGES.NETWORK.TIMEOUT,
          HTTP_STATUS.REQUEST_TIMEOUT,
          ERROR_MESSAGES.NETWORK.TIMEOUT_DETAILS,
          true
        );
      }

      throw new AnalysisError(
        ERROR_MESSAGES.NETWORK.CONNECTION,
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        error instanceof Error ? error.message : 'Failed to connect to server',
        true
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
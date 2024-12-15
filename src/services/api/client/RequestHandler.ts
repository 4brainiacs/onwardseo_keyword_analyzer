import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS, ERROR_MESSAGES } from '../constants';

export class RequestHandler {
  async sendRequest(url: string, config: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONSTANTS.TIMEOUTS.DEFAULT);

    try {
      logger.debug('Making request:', { url, method: config.method });

      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new AnalysisError(
          ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
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
          ERROR_MESSAGES.NETWORK.TIMEOUT,
          408,
          'The request took too long to complete',
          true
        );
      }

      throw new AnalysisError(
        ERROR_MESSAGES.NETWORK.CONNECTION,
        503,
        error instanceof Error ? error.message : 'Failed to connect to server',
        true
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
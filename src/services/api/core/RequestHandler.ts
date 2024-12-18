```typescript
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { HTTP_STATUS, API_CONSTANTS } from '../constants';
import type { RequestConfig } from '../types';

export class RequestHandler {
  async sendRequest(url: string, config: RequestConfig): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || API_CONSTANTS.TIMEOUTS.DEFAULT);

    try {
      logger.debug('Making request', { url, method: config.method });

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
        headers: {
          [API_CONSTANTS.HEADERS.CONTENT_TYPE]: API_CONSTANTS.CONTENT_TYPES.JSON,
          [API_CONSTANTS.HEADERS.ACCEPT]: API_CONSTANTS.CONTENT_TYPES.JSON,
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

      if (error instanceof TypeError && error.name === 'AbortError') {
        throw new AnalysisError(
          'Request timeout',
          HTTP_STATUS.REQUEST_TIMEOUT,
          'The request took too long to complete',
          true
        );
      }

      throw new AnalysisError(
        'Network error',
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        error instanceof Error ? error.message : 'Failed to connect to server',
        true
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
```
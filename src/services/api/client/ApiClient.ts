import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { ApiConfig } from '../types';
import type { RequestHandler } from '../handlers/RequestHandler';
import type { ResponseHandler } from '../handlers/ResponseHandler';

export class ApiClient {
  constructor(
    private config: ApiConfig,
    private requestHandler: RequestHandler,
    private responseHandler: ResponseHandler
  ) {}

  async analyze(url: string): Promise<any> {
    try {
      logger.info('Starting URL analysis', { url });

      const response = await this.requestHandler.sendRequest(
        `${this.config.baseUrl}/analyze`,
        {
          method: 'POST',
          headers: this.config.headers,
          body: JSON.stringify({ url })
        }
      );

      return await this.responseHandler.handleResponse(response);
    } catch (error) {
      logger.error('API request failed:', error);
      
      if (error instanceof AnalysisError) {
        throw error;
      }

      throw new AnalysisError(
        'Request failed',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}
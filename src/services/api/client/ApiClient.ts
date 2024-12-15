import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_ENDPOINTS } from '../config/endpoints';
import { RequestHandler } from '../handlers/RequestHandler';
import { ResponseHandler } from '../handlers/ResponseHandler';
import { RetryHandler } from '../handlers/RetryHandler';
import type { AnalysisResult } from '../../../types';

export class ApiClient {
  private requestHandler: RequestHandler;
  private responseHandler: ResponseHandler;
  private retryHandler: RetryHandler;

  constructor() {
    this.requestHandler = new RequestHandler();
    this.responseHandler = new ResponseHandler();
    this.retryHandler = new RetryHandler({
      maxAttempts: 3,
      baseDelay: 2000,
      maxDelay: 10000
    });
  }

  async analyze(url: string): Promise<AnalysisResult> {
    return this.retryHandler.execute(async () => {
      try {
        logger.info('Starting analysis', { url });

        const response = await this.requestHandler.sendRequest(
          API_ENDPOINTS.analyze,
          {
            method: 'POST',
            body: JSON.stringify({ url })
          }
        );

        return await this.responseHandler.handleResponse<AnalysisResult>(response);
      } catch (error) {
        logger.error('API request failed:', { error, url });
        throw AnalysisError.fromError(error);
      }
    }, 'analysis');
  }
}

export const apiClient = new ApiClient();
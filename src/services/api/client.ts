import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import { RequestHandler } from './handlers/RequestHandler';
import { ResponseHandler } from './handlers/ResponseHandler';
import { RetryHandler } from './handlers/RetryHandler';
import type { AnalysisResult } from '../../types';

export class ApiClient {
  private baseUrl: string = '/.netlify/functions';
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
          `${this.baseUrl}/analyze`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
          }
        );

        return await this.responseHandler.handleResponse<AnalysisResult>(response);
      } catch (error) {
        logger.error('API request failed:', { error, url });
        
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
    }, 'analysis');
  }
}

export const apiClient = new ApiClient();
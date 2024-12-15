import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { RequestHandler } from '../handlers/RequestHandler';
import { ResponseHandler } from '../handlers/ResponseHandler';
import { RetryHandler } from '../handlers/RetryHandler';
import type { AnalysisResult } from '../../../types';

export class ApiClient {
  private baseUrl: string;
  private requestHandler: RequestHandler;
  private responseHandler: ResponseHandler;
  private retryHandler: RetryHandler;

  constructor() {
    this.baseUrl = window.__RUNTIME_CONFIG__?.VITE_API_URL || '/.netlify/functions';
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
        logger.error('API request failed', { error });
        
        if (error instanceof AnalysisError) {
          throw error;
        }

        throw new AnalysisError({
          message: 'Request failed',
          status: 500,
          details: error instanceof Error ? error.message : 'An unexpected error occurred',
          retryable: true
        });
      }
    }, 'analysis');
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
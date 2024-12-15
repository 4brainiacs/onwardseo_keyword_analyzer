import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { RequestHandler } from '../handlers/RequestHandler';
import { ResponseHandler } from '../handlers/ResponseHandler';
import { RetryHandler } from '../handlers/RetryHandler';
import { API_CONSTANTS } from '../constants';
import type { AnalysisResult } from '../../../types';

export class ApiService {
  private requestHandler: RequestHandler;
  private responseHandler: ResponseHandler;
  private retryHandler: RetryHandler;

  constructor(private baseUrl: string = '/.netlify/functions') {
    this.requestHandler = new RequestHandler();
    this.responseHandler = new ResponseHandler();
    this.retryHandler = new RetryHandler({
      maxAttempts: 3,
      baseDelay: API_CONSTANTS.TIMEOUTS.RETRY,
      maxDelay: API_CONSTANTS.TIMEOUTS.MAX_RETRY
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
            body: JSON.stringify({ url })
          }
        );

        return await this.responseHandler.handleResponse<AnalysisResult>(response);
      } catch (error) {
        this.handleError(error, { url });
      }
    }, 'analysis');
  }

  private handleError(error: unknown, context?: Record<string, unknown>): never {
    logger.error('API request failed:', { error, context });

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

export const apiService = new ApiService();
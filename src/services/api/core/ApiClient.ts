import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { ResponseValidator } from './ResponseValidator';
import { RequestBuilder } from './RequestBuilder';
import { RetryHandler } from './RetryHandler';
import type { AnalysisResult } from '../../../types';

export class ApiClient {
  private baseUrl: string = '/.netlify/functions';
  private responseValidator: ResponseValidator;
  private requestBuilder: RequestBuilder;
  private retryHandler: RetryHandler;

  constructor() {
    this.responseValidator = new ResponseValidator();
    this.requestBuilder = new RequestBuilder();
    this.retryHandler = new RetryHandler({
      maxAttempts: 3,
      baseDelay: 2000,
      maxDelay: 10000
    });
  }

  async analyze(url: string): Promise<AnalysisResult> {
    return this.retryHandler.execute(async () => {
      logger.info('Starting analysis', { url });
      
      const request = this.requestBuilder.buildRequest(url);
      const response = await fetch(request);
      
      await this.responseValidator.validateResponse(response);
      const data = await response.json();

      return this.responseValidator.validateAnalysisResult(data);
    }, 'analysis');
  }
}

export const apiClient = new ApiClient();
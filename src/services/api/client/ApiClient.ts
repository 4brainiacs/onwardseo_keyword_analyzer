import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { RetryHandler } from '../handlers/RetryHandler';
import { ResponseValidator } from '../validators/ResponseValidator';
import type { ApiClientConfig } from '../types/request';
import type { AnalysisResult } from '../../../types';

export class ApiClient {
  private retryHandler: RetryHandler;
  private responseValidator: ResponseValidator;

  constructor(private config: ApiClientConfig) {
    this.retryHandler = new RetryHandler(config.retryConfig);
    this.responseValidator = new ResponseValidator();
  }

  async analyze(url: string): Promise<AnalysisResult> {
    return this.retryHandler.execute(async () => {
      try {
        logger.info('Starting analysis', { url });

        const response = await fetch(`${this.config.baseUrl}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...this.config.headers
          },
          body: JSON.stringify({ url })
        });

        await this.responseValidator.validateResponse(response);
        return await this.responseValidator.validateApiResponse<AnalysisResult>(response);
      } catch (error) {
        logger.error('Analysis request failed:', error);
        throw error instanceof AnalysisError ? error : new AnalysisError(
          'Request failed',
          500,
          error instanceof Error ? error.message : 'An unexpected error occurred',
          true
        );
      }
    }, 'analysis');
  }
}
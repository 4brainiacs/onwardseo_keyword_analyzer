import { AnalysisError } from '../errors/AnalysisError';
import { logger } from '../../utils/logger';
import { API_CONFIG } from './config';
import { validateResponse } from './utils/validation';
import type { AnalysisResult } from '../../types';

class ApiClient {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.timeout = API_CONFIG.timeout;
  }

  async analyze(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting URL analysis', { url });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(`${this.baseUrl}/analyze`, {
          method: 'POST',
          signal: controller.signal,
          headers: API_CONFIG.headers,
          body: JSON.stringify({ url })
        });

        clearTimeout(timeoutId);
        return await validateResponse<AnalysisResult>(response);
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      logger.error('API request failed:', { error });

      if (error instanceof AnalysisError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new AnalysisError({
          message: 'Request timeout',
          status: 408,
          details: 'The request took too long to complete',
          retryable: true
        });
      }

      throw new AnalysisError({
        message: 'Request failed',
        status: 500,
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        retryable: true
      });
    }
  }
}

export const apiClient = new ApiClient();
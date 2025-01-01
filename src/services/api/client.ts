import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import { API_CONFIG } from '../../config/api';
import type { AnalysisResult } from '../../types';

class ApiClient {
  private readonly baseUrl: string;
  private readonly controller: AbortController;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.controller = new AbortController();
  }

  async analyze(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting analysis request', { url });

      const timeoutId = setTimeout(() => this.controller.abort(), API_CONFIG.timeout);

      try {
        const response = await fetch(`${this.baseUrl}/analyze`, {
          method: 'POST',
          signal: this.controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ url })
        });

        const text = await response.text();
        let data;
        
        try {
          data = JSON.parse(text);
        } catch (error) {
          throw new AnalysisError(
            'Invalid response format',
            500,
            'Server returned invalid JSON',
            true
          );
        }

        if (!response.ok) {
          throw new AnalysisError(
            data.error || 'Request failed',
            response.status,
            data.details || `Server returned status ${response.status}`,
            response.status >= 500,
            data.retryAfter
          );
        }

        if (!data.success || !data.data) {
          throw new AnalysisError(
            'Invalid response format',
            500,
            'Server returned unsuccessful response',
            true
          );
        }

        return data.data;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      logger.error('Request failed:', error);

      if (error instanceof AnalysisError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new AnalysisError(
          'Request timeout',
          408,
          'The request took too long to complete',
          true
        );
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

export const apiClient = new ApiClient();
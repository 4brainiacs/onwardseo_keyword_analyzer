import { AnalysisError } from '../errors/AnalysisError';
import { logger } from '../../utils/logger';
import { API_CONFIG } from './config';
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
          body: JSON.stringify({ url }),
          credentials: 'same-origin'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw await this.createErrorFromResponse(response);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new AnalysisError({
            message: 'Invalid content type',
            status: 415,
            details: `Expected JSON but received: ${contentType}`,
            retryable: false
          });
        }

        const text = await response.text();
        if (!text) {
          throw new AnalysisError({
            message: 'Empty response',
            status: 500,
            details: 'Server returned empty response',
            retryable: true
          });
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new AnalysisError({
            message: 'Invalid JSON response',
            status: 500,
            details: 'Server returned invalid JSON',
            retryable: true
          });
        }

        if (!data.success || !data.data) {
          throw new AnalysisError({
            message: data.error || 'Request failed',
            status: response.status,
            details: data.details || 'Server returned unsuccessful response',
            retryable: data.retryable,
            retryAfter: data.retryAfter
          });
        }

        return data.data;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      logger.error('API request failed:', error);

      if (error instanceof AnalysisError) {
        throw error;
      }

      if (error.name === 'AbortError') {
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

  private async createErrorFromResponse(response: Response): Promise<AnalysisError> {
    try {
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      
      return new AnalysisError({
        message: data?.error || `HTTP ${response.status}`,
        status: response.status,
        details: data?.details || response.statusText,
        retryable: response.status >= 500,
        retryAfter: data?.retryAfter
      });
    } catch {
      return new AnalysisError({
        message: `HTTP ${response.status}`,
        status: response.status,
        details: response.statusText,
        retryable: response.status >= 500
      });
    }
  }
}

export const apiClient = new ApiClient();
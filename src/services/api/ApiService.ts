import { AnalysisError } from '../errors/AnalysisError';
import { logger } from '../../utils/logger';
import { API_CONFIG } from '../../config/api';
import type { AnalysisResult } from '../../types';

export class ApiService {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.timeout = API_CONFIG.timeout;
  }

  async analyze(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting analysis', { url });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new AnalysisError(
          'Invalid content type',
          415,
          `Expected JSON but received: ${contentType}`,
          false
        );
      }

      const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        logger.error('Failed to parse JSON response:', { error, text: text.slice(0, 200) });
        throw new AnalysisError(
          'Invalid JSON response',
          500,
          'Server returned invalid JSON data',
          true
        );
      }

      if (!response.ok || !data.success) {
        throw new AnalysisError(
          data.error || 'Request failed',
          response.status,
          data.details || `Server returned status ${response.status}`,
          response.status >= 500,
          data.retryAfter
        );
      }

      return data.data;
    } catch (error) {
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

      logger.error('API request failed:', error);
      throw new AnalysisError(
        'Request failed',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}

export const apiService = new ApiService();
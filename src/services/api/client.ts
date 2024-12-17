import { AnalysisError } from '../errors/AnalysisError';
import { logger } from '../../utils/logger';
import type { ApiResponse, AnalysisResult } from '../../types';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = window.__RUNTIME_CONFIG__?.VITE_API_URL || '/.netlify/functions';
  }

  async analyze(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting analysis', { url });

      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new AnalysisError(
          'Request failed',
          response.status,
          `Server returned status ${response.status}`
        );
      }

      const data = await response.json() as ApiResponse<AnalysisResult>;

      if (!data.success || !data.data) {
        throw new AnalysisError(
          'Invalid response format',
          500,
          'Server returned unsuccessful response'
        );
      }

      return data.data;
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }

      throw new AnalysisError(
        'Request failed',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
}

export const apiClient = new ApiClient();
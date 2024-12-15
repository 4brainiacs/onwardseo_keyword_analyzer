import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { ApiResponse } from '../types';

export class ApiService {
  constructor(private baseUrl: string) {}

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new AnalysisError({
          message: `HTTP ${response.status}`,
          status: response.status,
          details: response.statusText,
          retryable: response.status >= 500
        });
      }

      const data = (await response.json()) as ApiResponse<T>;
      
      if (!data.success) {
        throw new AnalysisError({
          message: data.error,
          status: response.status,
          details: data.details,
          retryable: data.retryable
        });
      }

      return data.data;
    } catch (error) {
      logger.error('API request failed:', { error });
      throw error instanceof AnalysisError ? error : new AnalysisError({
        message: 'Request failed',
        status: 500,
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        retryable: true
      });
    }
  }
}
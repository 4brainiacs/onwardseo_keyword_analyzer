import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
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
        throw new AnalysisError(
          'Request failed',
          response.status,
          `Server returned status ${response.status}`,
          response.status >= 500
        );
      }

      const data = await response.json() as ApiResponse<T>;
      
      if (!data.success) {
        throw new AnalysisError(
          data.error || ERROR_MESSAGES.VALIDATION.INVALID_RESPONSE,
          response.status,
          data.details || 'Server returned unsuccessful response',
          data.retryable || false,
          data.retryAfter
        );
      }

      return data.data as T;
    } catch (error) {
      logger.error('API request failed:', { error });
      throw error instanceof AnalysisError ? error : new AnalysisError(
        'Request failed',
        HTTP_STATUS.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}
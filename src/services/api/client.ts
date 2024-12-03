import { env } from '../../config/environment';
import { logger } from '../../utils/logger';
import { AnalysisError, NetworkError } from '../errors';
import { apiConfig } from './config';
import type { ApiResponse } from './types';

export class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = env.api.baseUrl;
    this.timeout = apiConfig.timeout;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const requestId = crypto.randomUUID();

    try {
      logger.info('API Request:', { url, method: options.method || 'GET', requestId });

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...apiConfig.headers,
          'X-Request-ID': requestId,
          ...options.headers,
        }
      });

      const responseText = await response.text();
      
      if (!responseText) {
        throw new AnalysisError(
          'Empty response',
          500,
          'Server returned an empty response',
          true,
          undefined,
          requestId
        );
      }

      let data: ApiResponse<T>;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        logger.error('API Error Response:', responseText);
        throw new AnalysisError(
          'Invalid server response',
          500,
          'Server returned invalid JSON data',
          true,
          undefined,
          requestId
        );
      }

      if (!response.ok || !data.success) {
        throw new AnalysisError(
          data.error || 'Request failed',
          response.status,
          data.details || `Server returned status ${response.status}`,
          response.status >= 500,
          data.retryAfter,
          requestId
        );
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new NetworkError(
          'Network error',
          'Unable to connect to the server'
        );
      }

      throw AnalysisError.fromError(error, requestId);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const apiClient = new ApiClient();
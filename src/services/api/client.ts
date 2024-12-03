import { env } from '../../config/environment';
import { logger } from '../../utils/logger';
import { AnalysisError } from '../errors';
import { validateContentType, validateStatus, validateJsonResponse } from './utils/validation';
import { createRequestConfig } from './utils/request';
import { shouldRetry, calculateRetryDelay } from './utils/retry';
import { API_DEFAULTS } from './constants';
import type { ApiResponse, RequestConfig } from './types';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.api.baseUrl;
  }

  async request<T>(endpoint: string, options: RequestConfig = {}): Promise<T> {
    let attempt = 0;
    const maxAttempts = options.retries ?? API_DEFAULTS.MAX_RETRIES;

    while (attempt < maxAttempts) {
      try {
        const config = createRequestConfig({
          ...options,
          timeout: options.timeout ?? API_DEFAULTS.TIMEOUT
        });

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        // Validate response format
        validateContentType(response);
        validateStatus(response);
        
        const data = await validateJsonResponse<T>(response);
        return data.data as T;

      } catch (error) {
        attempt++;
        
        if (shouldRetry(error, attempt) && attempt < maxAttempts) {
          const delay = calculateRetryDelay(attempt);
          logger.warn(`Retrying request (${attempt}/${maxAttempts}) after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (error instanceof AnalysisError) {
          throw error;
        }

        throw new AnalysisError(
          'Request failed',
          500,
          error instanceof Error ? error.message : 'An unexpected error occurred',
          true
        );
      }
    }

    throw new AnalysisError(
      'Max retries exceeded',
      500,
      'The request failed after multiple attempts',
      false
    );
  }
}

export const apiClient = new ApiClient();
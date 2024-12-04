```typescript
import { env } from '../../config/environment';
import { logger } from '../../utils/logger';
import { AnalysisError } from '../errors';
import { validateResponse } from './validators/responseValidator';
import { buildRequest } from './utils/requestBuilder';
import { calculateRetryDelay, shouldRetry } from './utils/retry';
import type { ApiResponse, RequestConfig } from './types';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.api.baseUrl;
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    let attempt = 0;
    const maxAttempts = config.retries ?? 3;

    while (attempt < maxAttempts) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), config.timeout ?? 30000);

        const response = await fetch(`${this.baseUrl}${endpoint}`, buildRequest({
          ...config,
          signal: controller.signal
        }));

        clearTimeout(timeout);

        const result = await validateResponse<ApiResponse<T>>(response);
        return result.data;
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
      'Max retry attempts reached',
      500,
      `Failed after ${maxAttempts} attempts`,
      false
    );
  }
}

export const apiClient = new ApiClient();
```
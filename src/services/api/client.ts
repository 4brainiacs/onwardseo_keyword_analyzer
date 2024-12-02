import { env } from '../../config/environment';
import { ApiResponse, ApiError } from './types';
import { logger } from '../../utils/logger';

const DEFAULT_TIMEOUT = 30000;

export class ApiClient {
  private controller: AbortController;
  private timeout: number;

  constructor(timeout = DEFAULT_TIMEOUT) {
    this.controller = new AbortController();
    this.timeout = timeout;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${env.api.baseUrl}${endpoint}`;
    const timeoutId = setTimeout(() => this.controller.abort(), this.timeout);

    try {
      logger.info('API Request:', { url, method: options.method || 'GET' });

      const response = await fetch(url, {
        ...options,
        signal: this.controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        credentials: 'same-origin'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid response type from server');
      }

      const data = await response.json() as ApiResponse<T>;
      
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Invalid response format');
      }

      return data.data;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let error: ApiError;

    try {
      const data = await response.json();
      error = {
        message: data.error || 'Request failed',
        code: response.status.toString(),
        details: data.details,
        retryable: response.status >= 500,
        retryAfter: data.retryAfter
      };
    } catch {
      error = {
        message: `HTTP Error ${response.status}`,
        code: response.status.toString(),
        retryable: response.status >= 500
      };
    }

    logger.error('API Error:', { ...error, status: response.status });
    throw error;
  }

  private handleError(error: Error): never {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    throw error;
  }

  abort(): void {
    this.controller.abort();
  }
}

export const apiClient = new ApiClient();
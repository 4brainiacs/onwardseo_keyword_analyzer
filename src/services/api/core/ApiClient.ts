import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { HTTP_STATUS, API_CONSTANTS } from '../constants';
import type { ApiResponse } from '../types';

export class ApiClient {
  constructor(private config: { baseUrl: string; timeout: number }) {}

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await this.sendRequest(endpoint, options);
      return await this.handleResponse<T>(response);
    } catch (error) {
      logger.error('API request failed:', error);
      throw this.handleError(error);
    }
  }

  private async sendRequest(endpoint: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      return await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': API_CONSTANTS.CONTENT_TYPES.JSON,
          'Accept': API_CONSTANTS.CONTENT_TYPES.JSON,
          ...options.headers
        }
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get(API_CONSTANTS.HEADERS.CONTENT_TYPE);
    
    if (!contentType?.includes(API_CONSTANTS.CONTENT_TYPES.JSON)) {
      throw new AnalysisError(
        'Invalid content type',
        HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
        `Expected JSON but received: ${contentType}`,
        false
      );
    }

    const data = await response.json() as ApiResponse<T>;

    if (!data.success || !data.data) {
      throw new AnalysisError(
        data.error || 'Invalid response format',
        response.status,
        data.details || 'Server returned unsuccessful response',
        response.status >= 500
      );
    }

    return data.data;
  }

  private handleError(error: unknown): never {
    if (error instanceof AnalysisError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new AnalysisError(
        'Network error',
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        'Unable to connect to the server',
        true
      );
    }

    throw new AnalysisError(
      'Request failed',
      HTTP_STATUS.INTERNAL_ERROR,
      error instanceof Error ? error.message : 'An unexpected error occurred',
      true
    );
  }
}
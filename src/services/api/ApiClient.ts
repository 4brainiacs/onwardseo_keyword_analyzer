import { StatusCodes } from 'http-status-codes';
import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import { ResponseValidator } from './validators/ResponseValidator';
import { DEFAULT_API_CONFIG } from './config/defaults';
import type { ApiClientConfig, RequestConfig } from './types/requests';

export class ApiClient {
  private config: ApiClientConfig;
  private validator: ResponseValidator;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = {
      ...DEFAULT_API_CONFIG,
      ...config
    };
    this.validator = new ResponseValidator();
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort('Request timeout'),
      config.timeout ?? this.config.timeout
    );

    try {
      logger.info('Making API request', { url, method: config.method });

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
        headers: {
          ...this.config.headers,
          ...config.headers
        }
      });

      clearTimeout(timeout);

      const apiResponse = await this.validator.validateResponse<T>(response);
      return this.validator.validateApiResponse(apiResponse);
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof AnalysisError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new AnalysisError(
          'Request timeout',
          StatusCodes.REQUEST_TIMEOUT,
          'The request took too long to complete',
          true
        );
      }

      throw AnalysisError.fromError(error);
    }
  }
}

export const apiClient = new ApiClient();
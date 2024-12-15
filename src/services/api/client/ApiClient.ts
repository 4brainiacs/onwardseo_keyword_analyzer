import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import { API_CONSTANTS } from '../constants';
import { RequestHandler } from './RequestHandler';
import { ResponseHandler } from './ResponseHandler';
import type { AnalysisResult } from '../../../types';

export class ApiClient {
  private baseUrl: string;
  private requestHandler: RequestHandler;
  private responseHandler: ResponseHandler;

  constructor() {
    this.baseUrl = window.__RUNTIME_CONFIG__?.VITE_API_URL || '/.netlify/functions';
    this.requestHandler = new RequestHandler();
    this.responseHandler = new ResponseHandler();
  }

  async analyze(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting analysis', { url });

      const response = await this.requestHandler.sendRequest(
        `${this.baseUrl}/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': API_CONSTANTS.CONTENT_TYPES.JSON,
            'Accept': API_CONSTANTS.CONTENT_TYPES.JSON
          },
          body: JSON.stringify({ url })
        }
      );

      return await this.responseHandler.handleResponse<AnalysisResult>(response);
    } catch (error) {
      logger.error('API request failed', { error });
      throw error instanceof AnalysisError ? error : new AnalysisError({
        message: 'Request failed',
        status: 500,
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        retryable: true
      });
    }
  }
}

export const apiClient = new ApiClient();
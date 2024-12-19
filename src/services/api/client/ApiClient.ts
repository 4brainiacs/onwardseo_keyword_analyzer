import { AnalysisError } from '../../errors/AnalysisError';
import { logger } from '../../../utils/logger';
import { RequestBuilder } from './RequestBuilder';
import { ResponseValidator } from './ResponseValidator';
import type { AnalysisResult } from '../../../types';

export class ApiClient {
  private baseUrl: string;
  private requestBuilder: RequestBuilder;
  private responseValidator: ResponseValidator;

  constructor() {
    this.baseUrl = window.__RUNTIME_CONFIG__?.VITE_API_URL || '/.netlify/functions';
    this.requestBuilder = new RequestBuilder();
    this.responseValidator = new ResponseValidator();
  }

  async analyze(url: string): Promise<AnalysisResult> {
    const messageId = crypto.randomUUID();
    logger.info('Starting analysis', { url, messageId });

    try {
      const request = this.requestBuilder.buildAnalysisRequest(url, messageId);
      const response = await fetch(`${this.baseUrl}/analyze`, request);
      return await this.responseValidator.validateResponse(response);
    } catch (error) {
      logger.error('Analysis request failed:', { error, messageId });
      throw AnalysisError.fromError(error);
    }
  }
}
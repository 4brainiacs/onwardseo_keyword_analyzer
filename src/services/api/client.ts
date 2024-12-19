import { AnalysisError } from '../errors/AnalysisError';
import { logger } from '../../utils/logger';
import { MessageHandler } from '../messaging/MessageHandler';
import { handleApiError } from './errorHandler';
import type { AnalysisResult } from '../../types';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = window.__RUNTIME_CONFIG__?.VITE_API_URL || '/.netlify/functions';
  }

  async analyze(url: string): Promise<AnalysisResult> {
    const messageId = crypto.randomUUID();

    return MessageHandler.handleMessage(async () => {
      try {
        logger.info('Starting analysis', { url, messageId });

        const response = await fetch(`${this.baseUrl}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Request-ID': messageId
          },
          body: JSON.stringify({ url })
        });

        if (!response.ok) {
          throw new AnalysisError(
            'Request failed',
            response.status,
            `Server returned status ${response.status}`,
            response.status >= 500
          );
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new AnalysisError(
            'Invalid content type',
            415,
            `Expected JSON but received: ${contentType}`,
            false
          );
        }

        const data = await response.json();
        
        if (!data.success || !data.data) {
          throw new AnalysisError(
            data.error || 'Invalid response format',
            500,
            data.details || 'Server returned unsuccessful response',
            true
          );
        }

        return data.data;
      } catch (error) {
        throw handleApiError(error);
      }
    }, messageId);
  }
}

export const apiClient = new ApiClient();
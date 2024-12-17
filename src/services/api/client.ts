import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import { API_CONFIG } from '../../config/api';
import type { AnalysisResult } from '../../types';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  async analyze(url: string): Promise<AnalysisResult> {
    try {
      logger.info('Starting analysis', { url });

      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      // Handle non-200 responses first
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP Error ${response.status}`;
        let errorDetails = response.statusText;

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
            errorDetails = errorData.details || errorDetails;
          }
        } catch {
          // Use default error message if JSON parsing fails
        }

        throw new AnalysisError(
          errorMessage,
          response.status,
          errorDetails,
          response.status >= 500
        );
      }

      // Validate content type
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new AnalysisError(
          'Invalid content type',
          415,
          `Expected JSON but received: ${contentType}`,
          false
        );
      }

      // Parse JSON response
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (error) {
        logger.error('JSON parse error:', { error, responseText: text });
        throw new AnalysisError(
          'Invalid JSON response',
          500,
          'Server returned invalid JSON data',
          true
        );
      }

      if (!data.success) {
        throw new AnalysisError(
          data.error || 'Request failed',
          response.status,
          data.details || 'Server returned unsuccessful response',
          data.retryable,
          data.retryAfter
        );
      }

      return data.data;

    } catch (error) {
      logger.error('API request failed:', error);
      
      if (error instanceof AnalysisError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'TypeError') {
        if (error.message.includes('Failed to fetch')) {
          throw new AnalysisError(
            'Network error',
            503,
            'Unable to connect to the analysis service. Please check your connection.',
            true
          );
        }
      }

      throw new AnalysisError(
        'Request failed',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        true
      );
    }
  }
}

export const apiClient = new ApiClient();
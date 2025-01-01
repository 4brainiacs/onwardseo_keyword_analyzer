import { AnalysisError } from '../../errors/AnalysisError';
import { logger } from '../../../utils/logger';
import type { ApiResponse } from '../types';

export class ResponseValidator {
  static async validate<T>(response: Response): Promise<ApiResponse<T>> {
    // Log response details for debugging
    logger.debug('Validating response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      url: response.url
    });

    // Check response status first
    if (!response.ok) {
      throw new AnalysisError(
        'Request failed',
        response.status,
        `Server returned status ${response.status}: ${response.statusText}`,
        response.status >= 500
      );
    }

    // Validate content type
    await this.validateContentType(response);

    // Get and validate response text
    const text = await response.text();
    if (!text.trim()) {
      throw new AnalysisError(
        'Empty response',
        502,
        'Server returned empty response',
        true
      );
    }

    // Parse and validate JSON
    try {
      const data = JSON.parse(text);
      return this.validateResponseStructure(data);
    } catch (error) {
      logger.error('Response validation failed:', {
        error,
        responseText: text.slice(0, 200),
        contentType: response.headers.get('content-type')
      });
      throw new AnalysisError(
        'Invalid JSON response',
        502,
        'Server returned invalid JSON data',
        true
      );
    }
  }

  private static async validateContentType(response: Response): Promise<void> {
    const contentType = response.headers.get('content-type')?.toLowerCase();
    
    if (!contentType) {
      throw new AnalysisError(
        'Missing content type',
        415,
        'Response is missing content type header',
        false
      );
    }

    if (!contentType.includes('application/json')) {
      throw new AnalysisError(
        'Invalid content type',
        415,
        `Expected application/json but received: ${contentType}`,
        false
      );
    }
  }

  private static validateResponseStructure<T>(data: any): ApiResponse<T> {
    if (!data || typeof data !== 'object') {
      throw new AnalysisError(
        'Invalid response format',
        502,
        'Response is not a valid JSON object',
        true
      );
    }

    if (!('success' in data)) {
      throw new AnalysisError(
        'Invalid response format',
        502,
        'Response missing success field',
        true
      );
    }

    if (data.success && !data.data) {
      throw new AnalysisError(
        'Invalid response format',
        502,
        'Successful response missing data field',
        true
      );
    }

    if (!data.success && !data.error) {
      throw new AnalysisError(
        'Invalid response format',
        502,
        'Error response missing error field',
        true
      );
    }

    return data;
  }
}
import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import type { ApiResponse, ApiError } from './types';

export class ResponseValidator {
  static validateContentType(response: Response): void {
    const contentType = response.headers.get('content-type');
    
    if (!contentType) {
      throw new AnalysisError(
        'Missing content type',
        500,
        'Server response is missing content type header'
      );
    }

    if (contentType.includes('text/html')) {
      throw new AnalysisError(
        'HTML response received',
        500,
        'Server returned HTML instead of JSON'
      );
    }

    if (!contentType.includes('application/json')) {
      throw new AnalysisError(
        'Invalid content type',
        500,
        `Expected JSON but received: ${contentType}`
      );
    }
  }

  static validateStatus(response: Response): void {
    if (response.status === 429) {
      throw new AnalysisError(
        'Rate limit exceeded',
        429,
        'Too many requests. Please try again later.',
        true,
        15000
      );
    }

    if (!response.ok) {
      throw new AnalysisError(
        'Request failed',
        response.status,
        `Server returned status ${response.status}`
      );
    }
  }

  static async validateResponseBody(response: Response): Promise<ApiResponse> {
    let text: string;
    
    try {
      text = await response.text();
    } catch (error) {
      throw new AnalysisError(
        'Failed to read response',
        500,
        'Could not read server response'
      );
    }

    if (!text || !text.trim()) {
      throw new AnalysisError(
        'Empty response',
        500,
        'Server returned an empty response'
      );
    }

    // Check for HTML content
    if (text.trim().toLowerCase().startsWith('<!doctype') ||
        text.trim().toLowerCase().startsWith('<html')) {
      throw new AnalysisError(
        'HTML response received',
        500,
        'Server returned HTML instead of JSON'
      );
    }

    try {
      const data = JSON.parse(text);
      return data;
    } catch (error) {
      logger.error('JSON parse error', { 
        error, 
        responsePreview: text.slice(0, 200) 
      });
      
      throw new AnalysisError(
        'Invalid JSON response',
        500,
        'Server returned invalid JSON data'
      );
    }
  }

  static validateScrapingBeeResponse(data: unknown): void {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new AnalysisError(
        'Invalid response format',
        500,
        'Server returned unexpected data format'
      );
    }

    const response = data as Partial<ApiResponse>;
    
    if (response.error) {
      throw new AnalysisError(
        response.error,
        500,
        response.details || 'ScrapingBee returned an error'
      );
    }

    // Validate extracted content
    if (!response.data) {
      throw new AnalysisError(
        'Missing content',
        500,
        'Failed to extract page content'
      );
    }
  }
}
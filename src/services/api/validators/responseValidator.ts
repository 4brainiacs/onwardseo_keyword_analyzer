import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { ApiResponse } from '../types';

interface ErrorResponse {
  message?: string;
  details?: string;
}

export class ResponseValidator {
  public static async validateResponse<T>(response: Response): Promise<T> {
    try {
      await this.validateContentType(response);
      const data = await this.parseAndValidateResponse<T>(response);
      return data;
    } catch (error) {
      logger.error('Response validation failed:', error);
      throw error instanceof AnalysisError ? error : new AnalysisError(
        'Failed to validate response',
        500,
        error instanceof Error ? error.message : 'Unknown error occurred',
        true
      );
    }
  }

  private static async validateContentType(response: Response): Promise<void> {
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new AnalysisError(
        'Invalid content type',
        415,
        `Expected JSON but received: ${contentType}`,
        false
      );
    }
  }

  private static async parseAndValidateResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      throw new AnalysisError(
        error.message || 'Request failed',
        response.status,
        error.details || `Server returned status ${response.status}`,
        response.status >= 500
      );
    }

    const data = await response.json() as ApiResponse<T>;
    
    if (!data.success || !data.data) {
      throw new AnalysisError(
        data.error || 'Invalid response format',
        500,
        data.details || 'Server returned unsuccessful response',
        true
      );
    }

    return data.data;
  }

  private static async parseErrorResponse(response: Response): Promise<ErrorResponse> {
    try {
      const data = await response.json();
      return {
        message: data.error,
        details: data.details
      };
    } catch {
      return {
        message: `HTTP ${response.status}`,
        details: response.statusText
      };
    }
  }
}
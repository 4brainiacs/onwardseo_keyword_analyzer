import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export class ResponseValidator {
  static validateContentType(response: Response): void {
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      throw new AnalysisError('Invalid content type', 500);
    }
  }

  static validateStatus(response: Response): void {
    if (!response.ok) {
      throw new AnalysisError('Request failed', response.status);
    }
  }

  static async validateResponseBody<T>(response: Response): Promise<T> {
    try {
      const data = await response.json();
      return data as T;
    } catch (error) {
      logger.error('Response validation failed:', error);
      throw new AnalysisError('Invalid response format', 500);
    }
  }
}
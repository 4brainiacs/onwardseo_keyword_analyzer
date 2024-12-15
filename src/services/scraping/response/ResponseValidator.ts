import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export class ResponseValidator {
  async validateResponse(response: Response): Promise<void> {
    if (!response.ok) {
      const error = await this.parseErrorResponse(response);
      throw new AnalysisError(
        error.message || 'Request failed',
        response.status,
        error.details,
        response.status >= 500
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('text/html')) {
      throw new AnalysisError(
        'Invalid content type',
        415,
        `Expected HTML but received: ${contentType}`,
        false
      );
    }
  }

  private async parseErrorResponse(response: Response): Promise<{ message?: string; details?: string }> {
    try {
      const data = await response.json();
      return {
        message: data.error,
        details: data.details
      };
    } catch (error) {
      logger.error('Failed to parse error response:', error);
      return {
        message: `HTTP ${response.status}`,
        details: response.statusText
      };
    }
  }
}
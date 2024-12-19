import { AnalysisError } from '../../errors/AnalysisError';
import { logger } from '../../../utils/logger';
import type { AnalysisResult } from '../../../types';

export class ResponseValidator {
  async validateResponse(response: Response): Promise<AnalysisResult> {
    if (!response.ok) {
      throw new AnalysisError(
        'Request failed',
        response.status,
        `Server returned status ${response.status}`,
        response.status >= 500
      );
    }

    await this.validateContentType(response);
    const data = await this.parseResponse(response);
    return this.validateData(data);
  }

  private async validateContentType(response: Response): Promise<void> {
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

  private async parseResponse(response: Response): Promise<any> {
    try {
      return await response.json();
    } catch (error) {
      logger.error('Failed to parse response:', error);
      throw new AnalysisError(
        'Invalid JSON response',
        500,
        'Server returned invalid JSON data',
        true
      );
    }
  }

  private validateData(data: any): AnalysisResult {
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
}
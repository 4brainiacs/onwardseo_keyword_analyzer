import { AnalysisError } from '../../errors/AnalysisError';
import { logger } from '../../../utils/logger';
import { ERROR_MESSAGES } from '../constants';

export class ResponseParser {
  static async parseResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    
    // Log raw response for debugging
    logger.debug('Raw response:', {
      status: response.status,
      contentType: response.headers.get('content-type'),
      bodyPreview: text.slice(0, 200)
    });

    // Handle empty responses
    if (!text.trim()) {
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.EMPTY_RESPONSE,
        500,
        'Server returned empty response',
        true
      );
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      logger.error('JSON parse error:', { error, responseText: text.slice(0, 200) });
      throw new AnalysisError(
        ERROR_MESSAGES.VALIDATION.INVALID_JSON,
        500,
        'Server returned invalid JSON data',
        true
      );
    }
  }
}
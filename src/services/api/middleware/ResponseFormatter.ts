import { logger } from '../../../utils/logger';
import type { ApiResponse } from '../types';

export class ResponseFormatter {
  static async formatResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const text = await response.text();
      
      // Try to parse as JSON
      try {
        return JSON.parse(text);
      } catch (error) {
        logger.error('Failed to parse response as JSON:', { 
          text: text.slice(0, 200),
          contentType: response.headers.get('content-type')
        });
        
        return {
          success: false,
          error: 'Invalid JSON response',
          details: 'Server returned invalid JSON data'
        };
      }
    } catch (error) {
      logger.error('Response formatting failed:', error);
      return {
        success: false,
        error: 'Failed to process response',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
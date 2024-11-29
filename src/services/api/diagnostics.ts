import { logger } from '../../utils/logger';

export class ResponseDiagnostics {
  static async analyzeResponse(response: Response): Promise<void> {
    try {
      // Log response metadata
      logger.info('Response metadata:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        type: response.type,
        url: response.url
      });

      // Clone response to read body multiple times
      const clonedResponse = response.clone();
      
      // Get raw text content
      const rawText = await clonedResponse.text();
      
      // Log raw response preview
      logger.info('Raw response preview:', {
        length: rawText.length,
        preview: rawText.substring(0, 1000),
        startsWithHTML: rawText.trim().toLowerCase().startsWith('<!doctype') || 
                       rawText.trim().toLowerCase().startsWith('<html'),
        contentType: response.headers.get('content-type')
      });

      // Attempt JSON parse
      try {
        JSON.parse(rawText);
        logger.info('JSON parse successful');
      } catch (parseError) {
        logger.error('JSON parse failed', {
          error: parseError,
          rawContent: rawText
        });
      }
    } catch (error) {
      logger.error('Diagnostics error', { error });
    }
  }
}</content>
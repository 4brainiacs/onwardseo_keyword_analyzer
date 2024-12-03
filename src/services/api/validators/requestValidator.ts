import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

const MAX_BODY_SIZE = 1024 * 1024; // 1MB
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

export async function validateRequest(url: string, options: RequestInit): Promise<void> {
  try {
    // Validate URL
    if (!url) {
      throw new AnalysisError('URL is required', 400);
    }

    // Validate method
    const method = options.method?.toUpperCase() || 'GET';
    if (!ALLOWED_METHODS.includes(method)) {
      throw new AnalysisError(
        'Invalid HTTP method',
        400,
        `Method ${method} is not allowed`
      );
    }

    // Validate body size for POST/PUT requests
    if (options.body && ['POST', 'PUT'].includes(method)) {
      const bodySize = new Blob([options.body]).size;
      if (bodySize > MAX_BODY_SIZE) {
        throw new AnalysisError(
          'Request body too large',
          413,
          `Maximum allowed size is ${MAX_BODY_SIZE / 1024}KB`
        );
      }

      // Validate JSON body
      try {
        JSON.parse(options.body as string);
      } catch (error) {
        throw new AnalysisError(
          'Invalid JSON body',
          400,
          'Request body must be valid JSON'
        );
      }
    }

    // Validate headers
    const headers = options.headers as Record<string, string>;
    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        if (!value || typeof value !== 'string') {
          throw new AnalysisError(
            'Invalid header value',
            400,
            `Header "${key}" has invalid value`
          );
        }
      }
    }
  } catch (error) {
    logger.error('Request validation failed:', error);
    throw error instanceof AnalysisError ? error : new AnalysisError(
      'Invalid request',
      400,
      error instanceof Error ? error.message : 'Request validation failed'
    );
  }
}
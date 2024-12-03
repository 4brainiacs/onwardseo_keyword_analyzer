import { z } from 'zod';
import { AnalysisError } from '../errors/AnalysisError';
import { logger } from '../../utils/logger';

const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown(),
  error: z.string().optional(),
  details: z.string().optional(),
  retryAfter: z.number().optional(),
  timestamp: z.string().optional(),
  requestId: z.string().optional()
});

export function validateApiResponse<T>(response: unknown) {
  try {
    const validated = apiResponseSchema.parse(response);

    if (!validated.success || !validated.data) {
      throw new AnalysisError(
        validated.error || 'Invalid response format',
        500,
        validated.details || 'The server returned an unsuccessful response'
      );
    }

    return validated as { success: true; data: T };
  } catch (error) {
    if (error instanceof AnalysisError) {
      throw error;
    }

    logger.error('API response validation failed:', error);
    throw new AnalysisError(
      'Invalid response format',
      500,
      'The server returned an unexpected response format'
    );
  }
}
import { z } from 'zod';
import { AnalysisError } from '../errors/AnalysisError';
import { logger } from '../../utils/logger';

const baseResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  details: z.string().optional(),
  retryAfter: z.number().optional(),
  timestamp: z.string().optional()
});

const successResponseSchema = baseResponseSchema.extend({
  success: z.literal(true),
  data: z.unknown()
});

const errorResponseSchema = baseResponseSchema.extend({
  success: z.literal(false),
  error: z.string()
});

export async function validateResponse(response: Response): Promise<unknown> {
  try {
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new AnalysisError(
        'Invalid content type',
        500,
        'Expected JSON response but received: ' + contentType
      );
    }

    const text = await response.text();
    if (!text) {
      throw new AnalysisError(
        'Empty response',
        500,
        'Server returned an empty response'
      );
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new AnalysisError(
        'Invalid JSON response',
        500,
        'Server returned invalid JSON data'
      );
    }

    // Validate response structure
    try {
      if (!response.ok) {
        const errorResponse = errorResponseSchema.parse(data);
        throw new AnalysisError(
          errorResponse.error,
          response.status,
          errorResponse.details,
          response.status >= 500,
          errorResponse.retryAfter
        );
      }

      const successResponse = successResponseSchema.parse(data);
      return successResponse.data;
    } catch (error) {
      if (error instanceof AnalysisError) {
        throw error;
      }

      logger.error('Response validation failed:', error);
      throw new AnalysisError(
        'Invalid response format',
        500,
        'Server returned unexpected data format'
      );
    }
  } catch (error) {
    if (error instanceof AnalysisError) {
      throw error;
    }

    logger.error('Response validation failed:', error);
    throw new AnalysisError(
      'Failed to validate response',
      500,
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}
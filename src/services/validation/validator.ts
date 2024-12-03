import { z } from 'zod';
import { ValidationError } from '../errors';
import { logger } from '../../utils/logger';

const keywordAnalysisSchema = z.object({
  keyword: z.string().min(1),
  count: z.number().int().positive(),
  density: z.number().min(0).max(1),
  prominence: z.number().min(0).max(1)
});

const headingsSchema = z.object({
  h1: z.array(z.string()),
  h2: z.array(z.string()),
  h3: z.array(z.string()),
  h4: z.array(z.string())
});

const analysisResultSchema = z.object({
  title: z.string(),
  metaDescription: z.string(),
  headings: headingsSchema,
  totalWords: z.number().int().positive(),
  twoWordPhrases: z.array(keywordAnalysisSchema),
  threeWordPhrases: z.array(keywordAnalysisSchema),
  fourWordPhrases: z.array(keywordAnalysisSchema),
  scrapedContent: z.string()
});

export function validateAnalysisResult(data: unknown): void {
  try {
    const result = analysisResultSchema.safeParse(data);
    
    if (!result.success) {
      logger.error('Analysis result validation failed:', {
        errors: result.error.errors,
        data
      });
      
      throw new ValidationError(
        'Invalid analysis result',
        'The server returned data in an unexpected format'
      );
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    logger.error('Validation error:', error);
    throw new ValidationError(
      'Failed to validate analysis result',
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}
```typescript
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { AnalysisResult } from '../../../types';

export function validateResponse(data: unknown): AnalysisResult {
  try {
    if (!data || typeof data !== 'object') {
      throw new AnalysisError(
        'Invalid response format',
        500,
        'Server returned unexpected data format',
        true
      );
    }

    const result = data as Partial<AnalysisResult>;

    // Validate required fields
    const requiredFields = [
      'title',
      'headings',
      'totalWords',
      'twoWordPhrases',
      'threeWordPhrases',
      'fourWordPhrases',
      'scrapedContent'
    ] as const;

    for (const field of requiredFields) {
      if (!(field in result)) {
        throw new AnalysisError(
          'Missing required field',
          500,
          `Response is missing required field: ${field}`,
          true
        );
      }
    }

    // Validate data types
    if (typeof result.title !== 'string' || !result.title.trim()) {
      throw new AnalysisError(
        'Invalid title',
        500,
        'Title must be a non-empty string',
        true
      );
    }

    if (typeof result.totalWords !== 'number' || result.totalWords < 0) {
      throw new AnalysisError(
        'Invalid word count',
        500,
        'Total words must be a non-negative number',
        true
      );
    }

    if (typeof result.scrapedContent !== 'string') {
      throw new AnalysisError(
        'Invalid content',
        500,
        'Scraped content must be a string',
        true
      );
    }

    // Validate arrays
    const arrayFields = [
      'twoWordPhrases',
      'threeWordPhrases',
      'fourWordPhrases'
    ] as const;

    for (const field of arrayFields) {
      if (!Array.isArray(result[field])) {
        throw new AnalysisError(
          'Invalid phrases array',
          500,
          `${field} must be an array`,
          true
        );
      }

      for (const phrase of result[field] || []) {
        validatePhrase(phrase, field);
      }
    }

    return result as AnalysisResult;

  } catch (error) {
    logger.error('Response validation failed:', error);
    throw error instanceof AnalysisError ? error : new AnalysisError(
      'Invalid response',
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred',
      true
    );
  }
}

function validatePhrase(phrase: unknown, field: string): void {
  if (!phrase || typeof phrase !== 'object') {
    throw new AnalysisError(
      'Invalid phrase object',
      500,
      `Invalid phrase in ${field}`,
      true
    );
  }

  const p = phrase as any;

  if (typeof p.keyword !== 'string' || !p.keyword.trim()) {
    throw new AnalysisError(
      'Invalid phrase keyword',
      500,
      `Invalid keyword in ${field}`,
      true
    );
  }

  if (typeof p.count !== 'number' || p.count < 0) {
    throw new AnalysisError(
      'Invalid phrase count',
      500,
      `Invalid count in ${field}`,
      true
    );
  }

  if (typeof p.density !== 'number' || p.density < 0 || p.density > 1) {
    throw new AnalysisError(
      'Invalid phrase density',
      500,
      `Invalid density in ${field}`,
      true
    );
  }

  if (typeof p.prominence !== 'number' || p.prominence < 0 || p.prominence > 1) {
    throw new AnalysisError(
      'Invalid phrase prominence',
      500,
      `Invalid prominence in ${field}`,
      true
    );
  }
}
```
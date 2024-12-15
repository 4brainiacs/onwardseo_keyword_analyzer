import { AnalysisError } from '../errors/AnalysisError';

export function validateAnalysisResult(result) {
  if (!result || typeof result !== 'object') {
    throw new AnalysisError(
      'Invalid analysis result',
      500,
      'Result must be an object',
      true
    );
  }

  const requiredFields = [
    'title',
    'metaDescription',
    'headings',
    'totalWords',
    'twoWordPhrases',
    'threeWordPhrases',
    'fourWordPhrases',
    'scrapedContent'
  ];

  const missingFields = requiredFields.filter(field => !(field in result));
  if (missingFields.length > 0) {
    throw new AnalysisError(
      'Invalid analysis result',
      500,
      `Missing required fields: ${missingFields.join(', ')}`,
      true
    );
  }

  // Validate field types
  if (typeof result.title !== 'string') {
    throw new AnalysisError('Invalid title', 500, 'Title must be a string', true);
  }

  if (typeof result.totalWords !== 'number' || result.totalWords < 0) {
    throw new AnalysisError('Invalid word count', 500, 'Word count must be a positive number', true);
  }

  if (!Array.isArray(result.twoWordPhrases) || 
      !Array.isArray(result.threeWordPhrases) || 
      !Array.isArray(result.fourWordPhrases)) {
    throw new AnalysisError('Invalid phrases', 500, 'Phrases must be arrays', true);
  }

  return true;
}
import { AnalysisError } from '../errors';
import { logger } from '../../utils/logger';
import type { AnalysisResult } from '../../types';

export async function validateResponse(
  response: Response, 
  rawText: string
): Promise<AnalysisResult> {
  logger.info('Validating response', {
    status: response.status,
    contentType: response.headers.get('content-type'),
    responseLength: rawText.length
  });

  // Check response status
  if (!response.ok) {
    const status = response.status;
    let message = 'Request failed';
    let details = `Server returned status ${status}`;
    let retryable = status >= 500;

    if (status === 400) {
      try {
        const errorData = JSON.parse(rawText);
        message = errorData.error || 'Invalid request';
        details = errorData.details || 'Please check your input and try again';
        retryable = false;
      } catch {
        // If parsing fails, use default error message
      }
    }

    throw new AnalysisError(message, status, details, retryable, undefined, rawText);
  }

  // Parse JSON
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (parseError) {
    logger.error('JSON parse error', {
      error: parseError,
      responsePreview: rawText.substring(0, 500)
    });
    throw new AnalysisError(
      'Invalid JSON response',
      500,
      'The server returned invalid data. Please try again.',
      true,
      5000,
      rawText
    );
  }

  // Validate response structure
  if (!data || typeof data !== 'object') {
    throw new AnalysisError(
      'Invalid response structure',
      500,
      'The server returned an unexpected data format.',
      true,
      5000,
      rawText
    );
  }

  // Check success flag and data presence
  if (!data.success || !data.data) {
    const errorMessage = data.error || 'Invalid response format';
    const errorDetails = data.details || 'The server returned a response without required data.';
    
    throw new AnalysisError(
      errorMessage,
      500,
      errorDetails,
      true,
      5000,
      rawText
    );
  }

  return data.data;
}
import { AnalysisError } from '../../errors';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import { ContentTypeValidator } from './contentTypeValidator';
import type { ApiResponse } from '../types';

export async function validateResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    // Step 1: Validate Content-Type header
    ContentTypeValidator.validate(response);

    // Step 2: Get response text
    const text = await response.text();

    // Step 3: Check for empty response
    if (!text || !text.trim()) {
      throw new AnalysisError(
        'Empty response',
        HTTP_STATUS.SERVER_ERROR,
        'Server returned an empty response',
        true
      );
    }

    // Step 4: Check for HTML content
    if (text.trim().toLowerCase().startsWith('<!doctype') || 
        text.trim().toLowerCase().startsWith('<html')) {
      throw new AnalysisError(
        ERROR_MESSAGES.HTML_RESPONSE,
        HTTP_STATUS.SERVER_ERROR,
        'Server returned HTML instead of JSON. This usually indicates a server-side error.',
        true
      );
    }

    // Step 5: Parse JSON
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch (error) {
      logger.error('JSON parse error:', { error, responsePreview: text.slice(0, 200) });
      throw new AnalysisError(
        ERROR_MESSAGES.INVALID_JSON,
        HTTP_STATUS.SERVER_ERROR,
        'Failed to parse response as JSON',
        true
      );
    }

    // Step 6: Validate response structure
    if (!data || typeof data !== 'object') {
      throw new AnalysisError(
        ERROR_MESSAGES.INVALID_RESPONSE,
        HTTP_STATUS.SERVER_ERROR,
        'Server returned unexpected data format',
        true
      );
    }

    const apiResponse = data as ApiResponse<T>;

    // Step 7: Handle error responses
    if (!response.ok) {
      throw new AnalysisError(
        apiResponse.error || ERROR_MESSAGES.SERVER_ERROR,
        response.status,
        apiResponse.details || `Server returned status ${response.status}`,
        response.status >= HTTP_STATUS.SERVER_ERROR,
        apiResponse.retryAfter
      );
    }

    // Step 8: Validate success response
    if (!apiResponse.success || !apiResponse.data) {
      throw new AnalysisError(
        ERROR_MESSAGES.INVALID_RESPONSE,
        HTTP_STATUS.SERVER_ERROR,
        'Response is missing required fields',
        true
      );
    }

    return apiResponse;
  } catch (error) {
    if (error instanceof AnalysisError) {
      throw error;
    }

    throw new AnalysisError(
      'Response validation failed',
      HTTP_STATUS.SERVER_ERROR,
      error instanceof Error ? error.message : 'Failed to validate response',
      true
    );
  }
}
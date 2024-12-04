import { AnalysisError } from '../../errors';
import { CONTENT_TYPES, ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import type { ApiResponse } from '../types';

export function validateContentType(response: Response): void {
  const contentType = response.headers.get('content-type');
  
  if (!contentType) {
    return; // Some APIs don't set content-type header
  }

  const normalizedType = contentType.toLowerCase();
  if (!normalizedType.includes(CONTENT_TYPES.JSON)) {
    if (normalizedType.includes(CONTENT_TYPES.HTML)) {
      throw new AnalysisError(
        ERROR_MESSAGES.HTML_RESPONSE,
        HTTP_STATUS.SERVER_ERROR,
        'Server returned HTML instead of JSON. This usually indicates a server-side error.',
        true
      );
    }

    throw new AnalysisError(
      'Invalid content type',
      415,
      `Expected JSON but received: ${contentType}`,
      false
    );
  }
}

export async function validateJsonResponse<T>(response: Response): Promise<ApiResponse<T>> {
  let text: string;
  try {
    text = await response.text();
  } catch (error) {
    throw new AnalysisError(
      'Failed to read response',
      HTTP_STATUS.SERVER_ERROR,
      'Could not read server response',
      true
    );
  }

  if (!text || !text.trim()) {
    throw new AnalysisError(
      'Empty response',
      HTTP_STATUS.SERVER_ERROR,
      'Server returned an empty response',
      true
    );
  }

  try {
    // Early HTML detection
    const trimmedText = text.trim().toLowerCase();
    if (trimmedText.startsWith('<!doctype') || 
        trimmedText.startsWith('<html') ||
        trimmedText.includes('</html>')) {
      throw new AnalysisError(
        ERROR_MESSAGES.HTML_RESPONSE,
        HTTP_STATUS.SERVER_ERROR,
        'Server returned HTML instead of JSON. This usually indicates a server-side error.',
        true
      );
    }

    const data = JSON.parse(text);
    
    if (!data || typeof data !== 'object') {
      throw new AnalysisError(
        ERROR_MESSAGES.INVALID_RESPONSE,
        HTTP_STATUS.SERVER_ERROR,
        'Server returned unexpected data format',
        true
      );
    }

    if (!response.ok) {
      throw new AnalysisError(
        data.error || ERROR_MESSAGES.SERVER_ERROR,
        response.status,
        data.details || `Server returned status ${response.status}`,
        response.status >= HTTP_STATUS.SERVER_ERROR,
        data.retryAfter
      );
    }

    if (!data.success || !data.data) {
      throw new AnalysisError(
        ERROR_MESSAGES.INVALID_RESPONSE,
        HTTP_STATUS.SERVER_ERROR,
        'Response is missing required fields',
        true
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AnalysisError) {
      throw error;
    }

    throw new AnalysisError(
      ERROR_MESSAGES.INVALID_JSON,
      HTTP_STATUS.SERVER_ERROR,
      'Failed to parse response as JSON',
      true
    );
  }
}
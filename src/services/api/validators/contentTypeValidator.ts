import { AnalysisError } from '../../errors';
import { CONTENT_TYPES, ERROR_MESSAGES, HTTP_STATUS } from '../constants';

export class ContentTypeValidator {
  static validate(response: Response): void {
    const contentType = response.headers.get('content-type');
    
    if (!contentType) {
      return; // Some APIs don't set content-type header
    }

    const normalizedType = contentType.toLowerCase();
    
    if (normalizedType.includes(CONTENT_TYPES.HTML)) {
      throw new AnalysisError(
        ERROR_MESSAGES.HTML_RESPONSE,
        HTTP_STATUS.SERVER_ERROR,
        'Server returned HTML instead of JSON. This usually indicates a server-side error.',
        true
      );
    }

    if (!normalizedType.includes(CONTENT_TYPES.JSON)) {
      throw new AnalysisError(
        'Invalid content type',
        415,
        `Expected JSON but received: ${contentType}`,
        false
      );
    }
  }
}
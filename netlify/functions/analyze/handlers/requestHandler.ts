import { validateUrl } from '../../../../src/utils/validation/urlValidator';
import type { APIGatewayEvent } from 'aws-lambda';

export class RequestHandler {
  static validateRequest(event: APIGatewayEvent) {
    if (!event.body) {
      return {
        isValid: false,
        error: 'Missing request body',
        details: 'Request body is required'
      };
    }

    let url: string;
    try {
      const body = JSON.parse(event.body);
      url = body.url;
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid JSON',
        details: 'Request body must be valid JSON'
      };
    }

    if (!url) {
      return {
        isValid: false,
        error: 'Missing URL',
        details: 'URL is required in request body'
      };
    }

    const validation = validateUrl(url);
    if (!validation.isValid) {
      return {
        isValid: false,
        error: 'Invalid URL',
        details: validation.error
      };
    }

    return { isValid: true, url };
  }
}
import { API_CONFIG } from '../config';
import { logger } from '../../../utils/logger';

export class RequestBuilder {
  static build(url: string): Request {
    const endpoint = `${API_CONFIG.baseUrl}/analyze`;
    
    logger.debug('Building request:', { endpoint, url });
    
    return new Request(endpoint, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ url })
    });
  }
}
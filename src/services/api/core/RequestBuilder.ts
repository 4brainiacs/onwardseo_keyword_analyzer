import { API_CONFIG } from '../config/constants';

export class RequestBuilder {
  private baseUrl: string = '/.netlify/functions';

  buildRequest(url: string): Request {
    return new Request(`${this.baseUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(API_CONFIG.timeout)
    });
  }
}
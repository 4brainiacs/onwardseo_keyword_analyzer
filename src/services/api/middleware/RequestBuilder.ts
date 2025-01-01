import { API_CONFIG } from '../../../config/api';

export class RequestBuilder {
  static buildRequest(url: string, body: unknown): Request {
    return new Request(`${API_CONFIG.baseUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }
}
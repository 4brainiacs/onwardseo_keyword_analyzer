export class RequestBuilder {
  buildAnalysisRequest(url: string, messageId: string): RequestInit {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Request-ID': messageId
      },
      body: JSON.stringify({ url })
    };
  }
}
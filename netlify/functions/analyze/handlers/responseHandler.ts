export class ResponseHandler {
  static success<T>(data: T, headers: Record<string, string>) {
    const response = {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };
  }

  static error(status: number, error: string, details: string, headers: Record<string, string>) {
    const response = {
      success: false,
      error,
      details,
      retryable: status >= 500,
      retryAfter: status >= 500 ? 5000 : undefined,
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: status,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };
  }

  static badRequest(error: string, details: string, headers: Record<string, string>) {
    return this.error(400, error, details, headers);
  }

  static methodNotAllowed(headers: Record<string, string>) {
    return this.error(
      405,
      'Method not allowed',
      'Only POST requests are supported',
      headers
    );
  }
}
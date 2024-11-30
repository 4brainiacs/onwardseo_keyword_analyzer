export class AnalysisError extends Error {
  constructor(
    message: string,
    public status = 500,
    public details?: string,
    public retryable = false,
    public timeout?: number,
    public rawResponse?: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AnalysisError';

    // Capture error context
    Error.captureStackTrace(this, this.constructor);
    
    // Log detailed error information
    console.error('Analysis Error:', {
      message,
      status,
      details,
      retryable,
      timeout,
      context,
      stack: this.stack
    });
  }
}

export class ScrapingError extends AnalysisError {
  constructor(
    message: string,
    status = 500,
    details?: string,
    public responseData?: unknown
  ) {
    super(message, status, details);
    this.name = 'ScrapingError';
    
    console.error('Scraping Error:', {
      message,
      status,
      details,
      responseData,
      stack: this.stack
    });
  }
}

export class NetworkError extends AnalysisError {
  constructor(
    message: string,
    status = 500,
    public requestInfo?: {
      url: string;
      method: string;
      headers?: Record<string, string>;
    }
  ) {
    super(message, status);
    this.name = 'NetworkError';
    
    console.error('Network Error:', {
      message,
      status,
      requestInfo,
      stack: this.stack
    });
  }
}
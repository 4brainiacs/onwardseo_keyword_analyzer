export interface ScrapingConfig {
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  maxContentSize: number;
  headers: Record<string, string>;
}

export interface ScrapingResponse {
  html: string;
  statusCode: number;
  headers: Record<string, string>;
}

export class ScrapingError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public retryable: boolean = false,
    public details?: string
  ) {
    super(message);
    this.name = 'ScrapingError';
  }
}

export interface ScrapingBeeResponse {
  url?: string;
  statusCode?: number;
  body?: string;
  error?: string;
  message?: string;
}
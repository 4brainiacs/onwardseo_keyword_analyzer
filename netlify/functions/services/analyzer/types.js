export const CONTENT_TYPES = {
  HTML: 'text/html',
  XHTML: 'application/xhtml+xml'
} as const;

export const ERROR_TYPES = {
  EMPTY_RESPONSE: 'empty_response',
  INVALID_CONTENT: 'invalid_content',
  SCRAPING_ERROR: 'scraping_error',
  PROCESSING_ERROR: 'processing_error'
} as const;

export const ANALYSIS_CONFIG = {
  TIMEOUT: 30000,
  MAX_CONTENT_SIZE: 10 * 1024 * 1024, // 10MB
  MIN_WORD_LENGTH: 3,
  MAX_PHRASES: 10
} as const;
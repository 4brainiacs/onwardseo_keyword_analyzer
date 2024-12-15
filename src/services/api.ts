import { AnalysisError } from './errors';
import { logger } from '../utils/logger';
import type { AnalysisResult } from '../types';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const baseUrl = '/.netlify/functions';
    const url = `${baseUrl}${endpoint}`;
    
    logger.info('Fetching API:', { url, method: options.method });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Check content type
      const contentType = response.headers.get('content-type');
      logger.debug('Received Content-Type:', { contentType });
      
      if (!contentType?.includes('application/json')) {
        logger.error('Invalid content type:', { contentType });
        throw new AnalysisError(
          'Invalid content type',
          500,
          `Expected JSON but received: ${contentType}`,
          true
        );
      }

      // Get response text first
      const text = await response.text();
      
      if (!text.trim()) {
        throw new AnalysisError(
          'Empty response',
          500,
          'Server returned an empty response',
          true
        );
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        logger.error('JSON parse error:', { error: e, text });
        throw new AnalysisError(
          'Invalid JSON response',
          500,
          'Server returned invalid JSON data',
          true
        );
      }

      // Check for error response
      if (!response.ok || data.success === false) {
        throw new AnalysisError(
          data.error || 'Request failed',
          response.status,
          data.details || `Server returned status ${response.status}`,
          response.status >= 500,
          data.retryAfter || 5000
        );
      }

      // Validate response structure
      if (!data.success || typeof data.data === 'undefined') {
        logger.error('Invalid response format:', data);
        throw new AnalysisError(
          'Invalid response format',
          500,
          'Server returned unexpected data structure',
          true
        );
      }

      return data.data;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof AnalysisError) {
      throw error;
    }

    if (error.name === 'AbortError') {
      throw new AnalysisError(
        'Request timeout',
        408,
        'The request took too long to complete',
        true,
        5000
      );
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new AnalysisError(
        'Network error',
        503,
        'Unable to connect to the server',
        true,
        5000
      );
    }

    logger.error('API error:', error);
    throw new AnalysisError(
      'Request failed',
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred',
      true,
      5000
    );
  }
}

export async function analyzeUrl(url: string, retryCount = 0): Promise<AnalysisResult> {
  const MAX_RETRIES = 3;
  
  try {
    logger.info('Starting URL analysis', { url, attempt: retryCount + 1 });
    
    return await fetchApi<AnalysisResult>('/analyze', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
  } catch (error) {
    logger.error('Analysis failed:', { error, retryCount });

    if (error instanceof AnalysisError && error.retryable && retryCount < MAX_RETRIES) {
      const retryDelay = error.retryAfter || 5000;
      logger.info(`Retrying analysis after ${retryDelay}ms...`, { retryCount });
      
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return analyzeUrl(url, retryCount + 1);
    }

    throw error;
  }
}
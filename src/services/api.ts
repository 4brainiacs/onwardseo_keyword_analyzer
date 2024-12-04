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

      const contentType = response.headers.get('Content-Type');
      if (!contentType?.includes('application/json')) {
        logger.error('Invalid content type:', { 
          contentType,
          status: response.status
        });
        throw new AnalysisError(
          'Invalid response type',
          response.status,
          'Expected JSON response from server'
        );
      }

      const text = await response.text();
      logger.debug('Raw response:', { text });

      if (!text) {
        throw new AnalysisError(
          'Empty response',
          500,
          'Server returned an empty response'
        );
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        logger.error('JSON parse error:', { 
          error: e,
          text: text.substring(0, 1000)
        });
        throw new AnalysisError(
          'Invalid JSON response',
          500,
          'Server returned invalid JSON data'
        );
      }

      if (!response.ok) {
        throw new AnalysisError(
          data.error || 'Request failed',
          response.status,
          data.details || `Server returned status ${response.status}`,
          response.status >= 500,
          data.retryAfter
        );
      }

      if (!data.success || typeof data.data === 'undefined') {
        logger.error('Invalid response format:', data);
        throw new AnalysisError(
          'Invalid response format',
          500,
          'Server returned unexpected data structure'
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

    logger.error('Unhandled API error:', error);
    throw new AnalysisError(
      'Request failed',
      500,
      error.message || 'An unexpected error occurred',
      true,
      5000
    );
  }
}

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  try {
    logger.info('Starting URL analysis', { url });
    
    return await fetchApi<AnalysisResult>('/analyze', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
  } catch (error) {
    logger.error('Analysis failed:', error);
    throw error;
  }
}
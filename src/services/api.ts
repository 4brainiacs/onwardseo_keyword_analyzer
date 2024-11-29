import { AnalysisError } from './errors';
import type { ApiResponse } from './api/types';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(endpoint, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // First check content type
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new AnalysisError(
          'Invalid response type',
          500,
          'Server returned non-JSON response'
        );
      }

      // Get raw text
      const text = await response.text();
      
      if (!text) {
        throw new AnalysisError(
          'Empty response',
          500,
          'Server returned an empty response'
        );
      }

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new AnalysisError(
          'Invalid JSON response',
          500,
          'Server returned invalid JSON'
        );
      }

      // Check if response is ok
      if (!response.ok) {
        throw new AnalysisError(
          data?.error || 'Request failed',
          response.status,
          data?.details || `Server returned status ${response.status}`
        );
      }

      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new AnalysisError(
          'Invalid response format',
          500,
          'Server returned an unexpected response format'
        );
      }

      // Check for success flag and data
      if (!data.success || !data.data) {
        throw new AnalysisError(
          data.error || 'Invalid response',
          500,
          data.details || 'Server returned an invalid response structure'
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
        'The request took too long to complete'
      );
    }

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new AnalysisError(
        'Network error',
        500,
        'Failed to connect to the server'
      );
    }

    throw new AnalysisError(
      'Request failed',
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}
import { AnalysisError } from './errors';
import type { ApiResponse } from './api/types';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`/.netlify/functions${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new AnalysisError(
          error.error || 'Request failed',
          response.status,
          error.details || `Server returned status ${response.status}`
        );
      }

      const data = await response.json();
      
      if (!data || !data.success) {
        throw new AnalysisError(
          'Invalid response format',
          500,
          'Server returned an unexpected response format'
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

    if (error instanceof Error && error.name === 'AbortError') {
      throw new AnalysisError(
        'Request timeout',
        408,
        'The request took too long to complete'
      );
    }

    throw new AnalysisError(
      'Request failed',
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}
import { AnalysisError } from './errors';
import type { ApiResponse } from './api/types';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    console.log('Fetching API:', endpoint);
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
      console.log('API Response Status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('API Error:', error);
        throw new AnalysisError(
          error.error || 'Request failed',
          response.status,
          error.details || `Server returned status ${response.status}`
        );
      }

      const data = await response.json();
      console.log('API Response:', data);
      
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
    console.error('API Error:', error);
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
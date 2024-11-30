import { AnalysisError } from './errors';
import type { ApiResponse } from './api/types';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    console.log('Fetching API:', `${baseUrl}${endpoint}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
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

      const text = await response.text();
      console.log('Raw Response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('JSON Parse Error:', e);
        throw new AnalysisError('Invalid JSON response', 500);
      }

      if (!response.ok) {
        console.error('API Error:', data);
        throw new AnalysisError(
          data.error || 'Request failed',
          response.status,
          data.details || `Server returned status ${response.status}`
        );
      }

      if (!data || !data.success) {
        console.error('Invalid Response Format:', data);
        throw new AnalysisError(
          'Invalid response format',
          500,
          'Server returned an unexpected response format'
        );
      }

      console.log('API Response Data:', data);
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
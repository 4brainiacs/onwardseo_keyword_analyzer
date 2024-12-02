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
    
    logger.info('Fetching API:', url);
    
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

      if (!response.ok) {
        const text = await response.text();
        logger.error('API Error Response:', text);
        
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch (e) {
          throw new AnalysisError('Invalid server response', response.status);
        }

        throw new AnalysisError(
          errorData.error || 'Request failed',
          response.status,
          errorData.details || `Server returned status ${response.status}`
        );
      }

      const data = await response.json();
      
      if (!data || !data.success || !data.data) {
        logger.error('Invalid Response Format:', data);
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
    logger.error('API Error:', error);
    
    if (error instanceof AnalysisError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new AnalysisError(
        'Network error',
        503,
        'Unable to connect to the server. Please check your connection.'
      );
    }

    throw new AnalysisError(
      'Request failed',
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred'
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

    if (error instanceof AnalysisError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new AnalysisError(
        'Network error',
        503,
        'Unable to connect to the analysis service. Please try again.'
      );
    }

    throw new AnalysisError(
      'Failed to analyze webpage',
      500,
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}
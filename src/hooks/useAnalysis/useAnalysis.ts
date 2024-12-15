import { useState, useCallback } from 'react';
import { apiClient } from '../../services/api/client';
import { AnalysisError } from '../../services/errors';
import { logger } from '../../utils/logger';
import type { AnalysisResult } from '../../types';
import type { UseAnalysisOptions, UseAnalysisResult } from './types';

export function useAnalysis(options: UseAnalysisOptions = {}): UseAnalysisResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = useCallback(async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);

      logger.info('Starting analysis', { url });
      
      const data = await apiClient.analyze(url);
      
      if (!data || typeof data !== 'object') {
        throw new AnalysisError(
          'Invalid server response',
          500,
          'The server returned an unexpected data format',
          true
        );
      }

      setResult(data);
      setIsLoading(false);
      options.onSuccess?.(data);

    } catch (error) {
      const analysisError = error instanceof AnalysisError 
        ? error 
        : new AnalysisError(
            'Analysis failed',
            500,
            error instanceof Error ? error.message : 'An unexpected error occurred',
            true
          );

      logger.error('Analysis failed:', {
        error: analysisError,
        url,
        component: 'useAnalysis'
      });

      setError(analysisError);
      setIsLoading(false);
      options.onError?.(analysisError);
    }
  }, [options]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    analyze,
    reset,
    isLoading,
    error,
    result
  };
}
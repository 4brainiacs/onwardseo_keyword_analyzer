import { useState, useCallback } from 'react';
import { analyzeUrl } from '../services/api';
import { validateUrl } from '../utils/validation/urlValidator';
import { AnalysisError } from '../services/errors';
import { logger } from '../utils/logger';
import type { AnalysisResult } from '../types';

interface UseAnalysisOptions {
  onSuccess?: (data: AnalysisResult) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
}

export function useAnalysis(options: UseAnalysisOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const validation = validateUrl(url);
      if (!validation.isValid) {
        throw new AnalysisError(
          validation.error || 'Invalid URL',
          400,
          'Please provide a valid URL to analyze'
        );
      }

      logger.info('Starting analysis:', { url });
      const data = await analyzeUrl(url);
      
      setResult(data);
      setIsLoading(false);
      options.onSuccess?.(data);
    } catch (error) {
      const analysisError = error instanceof AnalysisError 
        ? error 
        : new AnalysisError(
            'Failed to analyze webpage',
            500,
            error instanceof Error ? error.message : 'An unexpected error occurred',
            true
          );

      setError(analysisError);
      setIsLoading(false);
      options.onError?.(analysisError);
      
      logger.error('Analysis failed:', {
        error: analysisError.toJSON(),
        url,
        component: 'useAnalysis'
      });
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
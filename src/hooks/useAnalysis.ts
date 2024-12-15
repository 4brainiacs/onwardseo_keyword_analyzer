import { useState, useCallback } from 'react';
import { apiClient } from '../services/api/client';
import { AnalysisError } from '../services/errors';
import { logger } from '../utils/logger';
import type { AnalysisResult } from '../types';

interface UseAnalysisOptions {
  onSuccess?: (data: AnalysisResult) => void;
  onError?: (error: Error) => void;
}

export function useAnalysis(options: UseAnalysisOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      logger.info('Starting analysis:', { url });
      
      const data = await apiClient.analyze(url);
      
      setResult(data);
      setIsLoading(false);
      options.onSuccess?.(data);

    } catch (error) {
      const analysisError = error instanceof AnalysisError 
        ? error 
        : AnalysisError.fromError(error);

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
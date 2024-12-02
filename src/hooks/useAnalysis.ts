import { useState, useCallback } from 'react';
import { analyzeUrl } from '../services/api';
import { validateUrl } from '../utils/validation';
import { logger } from '../utils/logger';
import type { AnalysisResult } from '../types';

interface UseAnalysisOptions {
  onSuccess?: (result: AnalysisResult) => void;
  onError?: (error: Error) => void;
}

export function useAnalysis(options: UseAnalysisOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = useCallback(async (url: string) => {
    const validation = validateUrl(url);
    if (!validation.isValid) {
      setError(new Error(validation.error));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await analyzeUrl(url);
      setResult(data);
      options.onSuccess?.(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Analysis failed');
      setError(err);
      options.onError?.(err);
      logger.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    analyze,
    reset,
    isLoading,
    error,
    result
  };
}
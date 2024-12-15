import { useState, useCallback } from 'react';
import { apiClient } from '../../services/api';
import { AnalysisError } from '../../services/errors';
import { logger } from '../../utils/logger';
import type { AnalysisResult } from '../../types';
import type { UseAnalysisOptions, UseAnalysisState } from './types';

export function useAnalysis(options: UseAnalysisOptions = {}) {
  const [state, setState] = useState<UseAnalysisState>({
    isLoading: false,
    error: null,
    result: null
  });

  const analyze = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await apiClient.analyze(url);
      setState({ isLoading: false, error: null, result });
      options.onSuccess?.(result);
    } catch (error) {
      const analysisError = error instanceof AnalysisError ? 
        error : 
        new AnalysisError(
          'Analysis failed',
          500,
          error instanceof Error ? error.message : 'Unknown error',
          true
        );
      
      setState({ isLoading: false, error: analysisError, result: null });
      options.onError?.(analysisError);
      logger.error('Analysis failed', error);
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, result: null });
  }, []);

  return {
    ...state,
    analyze,
    reset
  };
}
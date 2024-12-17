import { useState, useCallback } from 'react';
import { apiClient } from '../services/api/ApiClient';
import { AnalysisError } from '../services/errors/AnalysisError';
import { logger } from '../utils/logger';
import type { AnalysisResult } from '../types';

interface UseAnalysisOptions {
  onSuccess?: (result: AnalysisResult) => void;
  onError?: (error: AnalysisError) => void;
}

export function useAnalysis(options: UseAnalysisOptions = {}) {
  const [state, setState] = useState({
    isLoading: false,
    error: null as AnalysisError | null,
    result: null as AnalysisResult | null
  });

  const analyze = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      logger.info('Starting analysis:', { url });
      const result = await apiClient.analyze(url);
      
      setState({
        isLoading: false,
        error: null,
        result
      });
      
      options.onSuccess?.(result);
    } catch (error) {
      const analysisError = error instanceof AnalysisError 
        ? error 
        : AnalysisError.fromError(error);
      
      setState({
        isLoading: false,
        error: analysisError,
        result: null
      });
      
      options.onError?.(analysisError);
      logger.error('Analysis failed:', { error: analysisError });
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      result: null
    });
  }, []);

  return {
    ...state,
    analyze,
    reset
  };
}
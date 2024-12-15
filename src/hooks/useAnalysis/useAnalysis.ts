import { useState, useCallback } from 'react';
import { apiClient } from '../../services/api/client';
import { AnalysisError } from '../../services/errors';
import { logger } from '../../utils/logger';
import { LoadingState } from '../../services/api/types/state';
import type { AnalysisResult } from '../../types';

interface UseAnalysisOptions {
  onSuccess?: (result: AnalysisResult) => void;
  onError?: (error: AnalysisError) => void;
}

export function useAnalysis(options: UseAnalysisOptions = {}) {
  const [state, setState] = useState({
    status: LoadingState.IDLE,
    error: null as AnalysisError | null,
    result: null as AnalysisResult | null,
    retryCount: 0
  });

  const analyze = useCallback(async (url: string) => {
    setState(prev => ({ 
      ...prev, 
      status: LoadingState.LOADING, 
      error: null 
    }));

    try {
      const result = await apiClient.analyze(url);
      setState({ 
        status: LoadingState.SUCCESS, 
        error: null, 
        result,
        retryCount: 0
      });
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
      
      if (analysisError.retryable && state.retryCount < 3) {
        setState(prev => ({
          ...prev,
          status: LoadingState.RETRYING,
          retryCount: prev.retryCount + 1
        }));
        
        // Retry after delay
        setTimeout(() => analyze(url), analysisError.retryAfter);
        return;
      }

      setState({ 
        status: LoadingState.ERROR, 
        error: analysisError, 
        result: null,
        retryCount: 0
      });
      options.onError?.(analysisError);
      logger.error('Analysis failed', analysisError);
    }
  }, [options, state.retryCount]);

  const reset = useCallback(() => {
    setState({
      status: LoadingState.IDLE,
      error: null,
      result: null,
      retryCount: 0
    });
  }, []);

  return {
    ...state,
    analyze,
    reset,
    isLoading: state.status === LoadingState.LOADING || 
               state.status === LoadingState.RETRYING
  };
}
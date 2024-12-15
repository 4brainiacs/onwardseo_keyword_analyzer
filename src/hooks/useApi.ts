import { useState, useCallback } from 'react';
import { LoadingState } from '../services/api/types/state';
import { AnalysisError } from '../services/errors';
import { logger } from '../utils/logger';
import type { ApiState } from '../services/api/types/state';

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: AnalysisError) => void;
  retryCount?: number;
}

export function useApi<T>(options: UseApiOptions<T> = {}) {
  const [state, setState] = useState<ApiState<T>>({
    status: LoadingState.IDLE,
    data: null,
    error: null,
    retryCount: 0
  });

  const request = useCallback(async (
    endpoint: string,
    requestOptions: RequestInit = {}
  ) => {
    setState(prev => ({ 
      ...prev, 
      status: LoadingState.LOADING, 
      error: null 
    }));

    try {
      const response = await fetch(endpoint, {
        ...requestOptions,
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions.headers
        }
      });

      if (!response.ok) {
        throw new AnalysisError(
          'Request failed',
          response.status,
          await response.text(),
          response.status >= 500
        );
      }

      const data = await response.json();
      
      setState({
        status: LoadingState.SUCCESS,
        data,
        error: null,
        retryCount: 0
      });

      options.onSuccess?.(data);
    } catch (error) {
      logger.error('API request failed:', error);

      const analysisError = error instanceof AnalysisError 
        ? error 
        : new AnalysisError(
            'Request failed',
            500,
            error instanceof Error ? error.message : 'Unknown error',
            true
          );

      if (analysisError.retryable && state.retryCount < (options.retryCount || 3)) {
        setState(prev => ({
          ...prev,
          status: LoadingState.RETRYING,
          retryCount: prev.retryCount + 1
        }));

        setTimeout(() => {
          request(endpoint, requestOptions);
        }, analysisError.retryAfter);

        return;
      }

      setState({
        status: LoadingState.ERROR,
        data: null,
        error: analysisError,
        retryCount: 0
      });

      options.onError?.(analysisError);
    }
  }, [options, state.retryCount]);

  const reset = useCallback(() => {
    setState({
      status: LoadingState.IDLE,
      data: null,
      error: null,
      retryCount: 0
    });
  }, []);

  return {
    ...state,
    request,
    reset,
    isLoading: state.status === LoadingState.LOADING || 
               state.status === LoadingState.RETRYING,
    isError: state.status === LoadingState.ERROR,
    isSuccess: state.status === LoadingState.SUCCESS
  };
}
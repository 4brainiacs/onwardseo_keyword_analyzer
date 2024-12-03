import { useState, useCallback } from 'react';
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { ApiResponse, LoadingState } from '../types';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
}

export function useApi<T>(options: UseApiOptions<T> = {}) {
  const [state, setState] = useState<{
    status: LoadingState;
    data: T | null;
    error: Error | null;
    attempts: number;
  }>({
    status: 'idle',
    data: null,
    error: null,
    attempts: 0
  });

  const request = useCallback(async (
    endpoint: string,
    requestOptions: RequestInit = {}
  ) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));

    try {
      const response = await fetch(endpoint, {
        ...requestOptions,
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions.headers
        }
      });

      const data = (await response.json()) as ApiResponse<T>;

      if (!data.success || !data.data) {
        throw new AnalysisError(
          data.error || 'Request failed',
          response.status,
          data.details
        );
      }

      setState(prev => ({
        status: 'success',
        data: data.data as T,
        error: null,
        attempts: 0
      }));

      options.onSuccess?.(data.data as T);
    } catch (error) {
      logger.error('API request failed:', error);

      const analysisError = error instanceof AnalysisError 
        ? error 
        : AnalysisError.fromError(error);

      if (analysisError.retryable && state.attempts < (options.retryCount || 3)) {
        setState(prev => ({
          ...prev,
          status: 'retrying',
          attempts: prev.attempts + 1
        }));

        setTimeout(() => {
          request(endpoint, requestOptions);
        }, analysisError.retryAfter || 5000);

        return;
      }

      setState(prev => ({
        ...prev,
        status: 'error',
        error: analysisError,
        attempts: 0
      }));

      options.onError?.(analysisError);
    }
  }, [options, state.attempts]);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      data: null,
      error: null,
      attempts: 0
    });
  }, []);

  return {
    ...state,
    request,
    reset,
    isLoading: state.status === 'loading' || state.status === 'retrying',
    isError: state.status === 'error',
    isSuccess: state.status === 'success'
  };
}
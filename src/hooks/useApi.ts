import { useState, useCallback } from 'react';
import { apiClient } from '../services/api/client';
import { logger } from '../utils/logger';
import type { ApiState, LoadingState } from '../services/api/types';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  timeout?: number;
}

export function useApi<T>(options: UseApiOptions<T> = {}) {
  const [state, setState] = useState<ApiState<T>>({
    status: 'idle',
    error: null,
    data: null,
    retryCount: 0
  });

  const setStatus = (status: LoadingState) => {
    setState((prevState: ApiState<T>) => ({ ...prevState, status }));
  };

  const request = useCallback(async (
    endpoint: string,
    requestOptions: RequestInit = {}
  ): Promise<void> => {
    setStatus('loading');
    setState((prevState: ApiState<T>) => ({ ...prevState, error: null }));

    try {
      const data = await apiClient.analyze(endpoint);

      setState((prevState: ApiState<T>) => ({
        ...prevState,
        status: 'success',
        data,
        error: null
      }));

      options.onSuccess?.(data as T);
    } catch (error) {
      logger.error('API request failed:', { error });

      setState((prevState: ApiState<T>) => ({
        ...prevState,
        status: 'error',
        error: error as Error,
        retryCount: prevState.retryCount + 1,
        lastAttempt: new Date()
      }));

      options.onError?.(error as Error);
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      error: null,
      data: null,
      retryCount: 0
    });
  }, []);

  return {
    ...state,
    request,
    reset,
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    isSuccess: state.status === 'success'
  };
}
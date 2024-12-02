import { useState, useCallback } from 'react';
import { ApiState, ApiStatus } from '../services/api/types';
import { apiClient } from '../services/api/client';
import { logger } from '../utils/logger';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  timeout?: number;
}

export function useApi(options: UseApiOptions = {}) {
  const [state, setState] = useState<ApiState>({
    status: 'idle',
    error: null,
    data: null,
    retryCount: 0
  });

  const setStatus = (status: ApiStatus) => {
    setState(prev => ({ ...prev, status }));
  };

  const request = useCallback(async <T>(
    endpoint: string,
    requestOptions: RequestInit = {}
  ): Promise<T | null> => {
    setStatus('loading');
    setState(prev => ({ ...prev, error: null }));

    try {
      const data = await apiClient.request<T>(endpoint, {
        ...requestOptions,
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions.headers,
        },
      });

      setState(prev => ({
        ...prev,
        status: 'success',
        data,
        error: null
      }));

      options.onSuccess?.(data);
      return data;
    } catch (error) {
      logger.error('API request failed:', error);

      setState(prev => ({
        ...prev,
        status: 'error',
        error: error as Error,
        retryCount: prev.retryCount + 1,
        lastAttempt: new Date()
      }));

      options.onError?.(error as Error);
      return null;
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
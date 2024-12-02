import { useState, useCallback } from 'react';
import { ApiState, ApiStatus } from '../services/api/types';
import { apiClient } from '../services/api/client';
import { logger } from '../utils/logger';
import type { AnalysisResult } from '../types';

interface UseApiOptions {
  onSuccess?: (data: AnalysisResult) => void;
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

  const request = useCallback(async (
    endpoint: string,
    requestOptions: RequestInit = {}
  ): Promise<void> => {
    setStatus('loading');
    setState(prev => ({ ...prev, error: null }));

    try {
      const data = await apiClient.request<AnalysisResult>(endpoint, {
        ...requestOptions,
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions.headers,
        },
      });

      setState(prev => ({
        status: 'success',
        data,
        error: null,
        retryCount: prev.retryCount
      }));

      options.onSuccess?.(data);
    } catch (error) {
      logger.error('API request failed:', error);

      setState(prev => ({
        status: 'error',
        error: error as Error,
        data: null,
        retryCount: prev.retryCount + 1,
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
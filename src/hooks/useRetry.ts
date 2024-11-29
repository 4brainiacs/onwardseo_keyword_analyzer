import { useState, useCallback } from 'react';

interface RetryConfig {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

interface RetryState {
  attempts: number;
  isRetrying: boolean;
  error: Error | null;
}

export function useRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {}
) {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = config;

  const [state, setState] = useState<RetryState>({
    attempts: 0,
    isRetrying: false,
    error: null,
  });

  const calculateDelay = (attempt: number): number => {
    const delay = initialDelay * Math.pow(backoffFactor, attempt);
    return Math.min(delay, maxDelay);
  };

  const execute = useCallback(async (): Promise<T> => {
    setState((prevState: RetryState) => ({ ...prevState, isRetrying: false, error: null }));

    try {
      return await operation();
    } catch (error) {
      if (state.attempts >= maxAttempts) {
        setState((prevState: RetryState) => ({
          ...prevState,
          error: error as Error,
          isRetrying: false,
        }));
        throw error;
      }

      setState(prev => ({
        ...prev,
        attempts: prev.attempts + 1,
        isRetrying: true,
      }));

      const delay = calculateDelay(state.attempts);
      await new Promise(resolve => setTimeout(resolve, delay));

      return execute();
    }
  }, [operation, state.attempts, maxAttempts]);

  const reset = useCallback(() => {
    setState({
      attempts: 0,
      isRetrying: false,
      error: null,
    });
  }, []);

  return {
    execute,
    reset,
    attempts: state.attempts,
    isRetrying: state.isRetrying,
    error: state.error,
  };
}
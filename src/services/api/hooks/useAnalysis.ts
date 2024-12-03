import { useCallback } from 'react';
import { useApi } from './useApi';
import { validateUrl } from '../../../utils/validation/urlValidator';
import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';
import type { AnalysisResult } from '../../../types';

interface UseAnalysisOptions {
  onSuccess?: (data: AnalysisResult) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
}

export function useAnalysis(options: UseAnalysisOptions = {}) {
  const api = useApi<AnalysisResult>({
    onSuccess: options.onSuccess,
    onError: options.onError,
    retryCount: options.retryCount
  });

  const analyze = useCallback(async (url: string) => {
    try {
      const validation = validateUrl(url);
      if (!validation.isValid) {
        throw new AnalysisError(
          validation.error || 'Invalid URL',
          400,
          'Please provide a valid URL to analyze'
        );
      }

      logger.info('Starting analysis:', { url });
      await api.request('/.netlify/functions/analyze', {
        method: 'POST',
        body: JSON.stringify({ url })
      });
    } catch (error) {
      logger.error('Analysis failed:', error);
      throw error;
    }
  }, [api]);

  return {
    analyze,
    reset: api.reset,
    isLoading: api.isLoading,
    error: api.error,
    result: api.data
  };
}
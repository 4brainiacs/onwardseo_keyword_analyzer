import { API_DEFAULTS } from '../constants';
import { AnalysisError } from '../../errors';

export function calculateRetryDelay(attempt: number, baseDelay = API_DEFAULTS.RETRY_DELAY): number {
  const delay = Math.min(
    baseDelay * Math.pow(2, attempt),
    API_DEFAULTS.MAX_RETRY_DELAY
  );
  
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000;
}

export function shouldRetry(error: unknown, attempt: number): boolean {
  if (attempt >= API_DEFAULTS.MAX_RETRIES) {
    return false;
  }

  if (error instanceof AnalysisError) {
    return error.retryable;
  }

  if (error instanceof Error) {
    // Retry network errors
    if (error.message.includes('Failed to fetch') || 
        error.message.includes('NetworkError')) {
      return true;
    }

    // Retry timeouts
    if (error.message.includes('timeout') || 
        error.message.includes('aborted')) {
      return true;
    }
  }

  // Retry 5xx errors and rate limits
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status;
    return status >= 500 || status === 429;
  }

  return false;
}
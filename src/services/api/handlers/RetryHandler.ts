import { logger } from '../../../utils/logger';
import { API_CONSTANTS } from '../constants';
import type { RetryConfig } from '../types';

export class RetryHandler {
  constructor(private config: RetryConfig) {}

  async execute<T>(
    operation: () => Promise<T>,
    context: string,
    attempt: number = 0
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      logger.error(`${context} failed:`, { error, attempt });

      if (this.shouldRetry(error, attempt)) {
        const delay = this.calculateDelay(error, attempt);
        logger.info(`Retrying ${context} after ${delay}ms`, { attempt });
        
        await this.sleep(delay);
        return this.execute(operation, context, attempt + 1);
      }

      throw error;
    }
  }

  private shouldRetry(error: unknown, attempt: number): boolean {
    if (attempt >= this.config.maxAttempts) return false;

    if (error instanceof Error) {
      const status = (error as any).status;
      
      // Always retry server errors and rate limits
      if (status >= 500 || status === API_CONSTANTS.STATUS_CODES.RATE_LIMIT) {
        return true;
      }

      // Retry network errors
      if (error.name === 'NetworkError' || error.message.includes('network')) {
        return true;
      }

      // Check if error is explicitly marked as retryable
      return Boolean((error as any).retryable);
    }

    return false;
  }

  private calculateDelay(error: unknown, attempt: number): number {
    // Use rate limit timeout if specified
    if (error instanceof Error && (error as any).retryAfter) {
      return Math.min((error as any).retryAfter, this.config.maxDelay);
    }

    // Exponential backoff with jitter
    const exponentialDelay = this.config.initialDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000;
    return Math.min(exponentialDelay + jitter, this.config.maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
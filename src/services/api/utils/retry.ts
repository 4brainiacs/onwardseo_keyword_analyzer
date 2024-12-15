import { logger } from '../../../utils/logger';
import type { RetryConfig } from '../types';

export class RetryHandler {
  constructor(private config: RetryConfig) {}

  async execute<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < this.config.maxAttempts) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        attempt++;

        if (!this.config.shouldRetry(error, attempt)) {
          throw error;
        }

        const delay = this.calculateDelay(attempt);
        logger.warn(`Retrying ${context} (${attempt}/${this.config.maxAttempts}) after ${delay}ms`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          attempt,
          delay
        });

        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  private calculateDelay(attempt: number): number {
    const exponentialDelay = this.config.initialDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 1000;
    return Math.min(exponentialDelay + jitter, this.config.maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
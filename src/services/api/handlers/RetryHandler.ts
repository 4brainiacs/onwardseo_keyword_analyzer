import { logger } from '../../../utils/logger';
import type { RetryConfig, RetryContext } from '../types/retry';

export class RetryHandler {
  constructor(private config: RetryConfig) {}

  async execute<T>(
    operation: () => Promise<T>,
    context: string,
    attempt: number = 0
  ): Promise<T> {
    const startTime = Date.now();

    try {
      return await operation();
    } catch (error) {
      const retryContext: RetryContext = {
        attempt,
        error,
        startTime,
        retryCount: attempt + 1
      };

      logger.error(`${context} failed:`, { error, context: retryContext });

      if (attempt >= this.config.maxAttempts - 1) {
        throw error;
      }

      const delay = this.calculateDelay(attempt);
      logger.info(`Retrying ${context} after ${delay}ms`, retryContext);
      
      await this.sleep(delay);
      return this.execute(operation, context, attempt + 1);
    }
  }

  private calculateDelay(attempt: number): number {
    const baseDelay = this.config.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000;
    return Math.min(baseDelay + jitter, this.config.maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
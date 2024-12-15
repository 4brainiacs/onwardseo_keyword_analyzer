import { logger } from '../../../utils/logger';
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
      if (attempt >= this.config.maxAttempts) {
        logger.error(`Max retry attempts (${this.config.maxAttempts}) reached for ${context}`, {
          error,
          attempt
        });
        throw error;
      }

      if (!this.isRetryableError(error)) {
        logger.error(`Non-retryable error for ${context}`, { error });
        throw error;
      }

      const delay = this.calculateDelay(error, attempt);
      logger.info(`Retrying ${context} (attempt ${attempt + 1}/${this.config.maxAttempts}) after ${delay}ms`);
      
      await this.sleep(delay);
      return this.execute(operation, context, attempt + 1);
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      // Check for specific error properties
      const status = (error as any).status;
      if (status) {
        return status >= 500 || status === 429;
      }

      // Check for retryable flag
      return (error as any).retryable === true;
    }
    return false;
  }

  private calculateDelay(error: unknown, attempt: number): number {
    // Use retry-after header if available
    if (error instanceof Error && (error as any).retryAfter) {
      return Math.min((error as any).retryAfter, this.config.maxDelay);
    }

    // Exponential backoff with jitter
    const exponentialDelay = this.config.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * (this.config.baseDelay * 0.1); // 10% jitter
    return Math.min(exponentialDelay + jitter, this.config.maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
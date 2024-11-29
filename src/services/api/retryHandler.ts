import { logger } from '../../utils/logger';

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

export class RetryHandler {
  private config: RetryConfig;

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = {
      maxRetries: config.maxRetries || 3,
      baseDelay: config.baseDelay || 1000,
      maxDelay: config.maxDelay || 15000
    };
  }

  async execute<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt < this.config.maxRetries) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        attempt++;

        if (attempt >= this.config.maxRetries) {
          logger.error(`All retry attempts failed for ${context}`, { 
            error,
            attempts: attempt 
          });
          break;
        }

        const delay = this.calculateDelay(attempt, error);
        logger.warn(`Retry attempt ${attempt} for ${context}`, {
          error: error.message,
          nextDelay: delay
        });

        await this.sleep(delay);
      }
    }

    throw lastError || new Error('Operation failed after retries');
  }

  private calculateDelay(attempt: number, error: any): number {
    // Use rate limit timeout if specified
    if (error.timeout) {
      return error.timeout;
    }

    // Exponential backoff with jitter
    const baseDelay = Math.min(
      this.config.baseDelay * Math.pow(2, attempt - 1),
      this.config.maxDelay
    );
    
    return baseDelay + Math.random() * 1000;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
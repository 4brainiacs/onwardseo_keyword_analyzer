import { logger } from '../../../utils/logger';

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

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

      if (
        error instanceof Error &&
        error.name === 'AnalysisError' &&
        (error as any).retryable &&
        attempt < this.config.maxAttempts - 1
      ) {
        const delay = this.calculateDelay((error as any).retryAfter, attempt);
        logger.info(`Retrying ${context} after ${delay}ms`, { attempt });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.execute(operation, context, attempt + 1);
      }

      throw error;
    }
  }

  private calculateDelay(retryAfter: number | undefined, attempt: number): number {
    if (retryAfter) {
      return Math.min(retryAfter, this.config.maxDelay);
    }

    const exponentialDelay = this.config.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000;
    return Math.min(exponentialDelay + jitter, this.config.maxDelay);
  }
}
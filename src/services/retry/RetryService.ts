import { logger } from '../../utils/logger';

interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  timeout: number;
}

export class RetryService {
  private config: RetryConfig;

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = {
      maxAttempts: config.maxAttempts || 3,
      initialDelay: config.initialDelay || 2000,
      maxDelay: config.maxDelay || 10000,
      backoffFactor: config.backoffFactor || 2,
      timeout: config.timeout || 65000
    };
  }

  async execute<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let attempt = 1;
    let lastError: Error;

    while (attempt <= this.config.maxAttempts) {
      try {
        logger.info(`Attempt ${attempt} for ${context}`);
        return await this.executeWithTimeout(operation);
      } catch (error: any) {
        lastError = error;
        
        if (attempt < this.config.maxAttempts && this.shouldRetry(error)) {
          const delay = this.calculateDelay(attempt);
          logger.warn(`Retry attempt ${attempt} failed for ${context}`, {
            error: error.message,
            nextDelay: delay
          });
          
          await this.sleep(delay);
          attempt++;
        } else {
          logger.error(`Operation failed permanently for ${context}`, {
            error,
            attempts: attempt
          });
          throw error;
        }
      }
    }

    throw lastError;
  }

  private shouldRetry(error: any): boolean {
    // Always retry server errors (5xx)
    if (error.status >= 500) {
      return true;
    }

    // Retry rate limit errors
    if (error.status === 429) {
      return true;
    }

    // Retry network errors
    if (error.name === 'NetworkError' || 
        error.message.includes('network') ||
        error.message.includes('timeout')) {
      return true;
    }

    return false;
  }

  private calculateDelay(attempt: number): number {
    const exponentialDelay = this.config.initialDelay * 
      Math.pow(this.config.backoffFactor, attempt - 1);
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 1000;
    
    return Math.min(
      exponentialDelay + jitter,
      this.config.maxDelay
    );
  }

  private async executeWithTimeout<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Operation timed out after ${this.config.timeout}ms`));
        }, this.config.timeout);
      })
    ]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
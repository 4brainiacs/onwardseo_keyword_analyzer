import { logger } from '../../utils/logger';
import { BaseError } from './BaseError';

interface ErrorStats {
  count: number;
  lastOccurrence: Date;
}

export class ErrorTracker {
  private static errors: Map<string, ErrorStats> = new Map();

  static track(error: Error | BaseError, context?: Record<string, unknown>): void {
    const errorKey = this.getErrorKey(error);
    const existing = this.errors.get(errorKey) || { count: 0, lastOccurrence: new Date() };

    this.errors.set(errorKey, {
      count: existing.count + 1,
      lastOccurrence: new Date()
    });

    logger.error('Error tracked:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error instanceof BaseError && {
          status: error.status,
          details: error.details,
          retryable: error.retryable
        })
      },
      context,
      occurrences: existing.count + 1
    });
  }

  private static getErrorKey(error: Error): string {
    return `${error.name}:${error.message}`;
  }

  static getStats(): { 
    totalErrors: number;
    errorsByType: Record<string, number>;
    recentErrors: Array<{ 
      type: string; 
      count: number; 
      lastOccurrence: Date 
    }>;
  } {
    const stats = {
      totalErrors: 0,
      errorsByType: {} as Record<string, number>,
      recentErrors: [] as Array<{ type: string; count: number; lastOccurrence: Date }>
    };

    this.errors.forEach((data, key) => {
      const [type] = key.split(':');
      stats.totalErrors += data.count;
      stats.errorsByType[type] = (stats.errorsByType[type] || 0) + data.count;
      stats.recentErrors.push({
        type,
        count: data.count,
        lastOccurrence: data.lastOccurrence
      });
    });

    stats.recentErrors.sort((a, b) => b.lastOccurrence.getTime() - a.lastOccurrence.getTime());

    return stats;
  }

  static clear(): void {
    this.errors.clear();
  }
}
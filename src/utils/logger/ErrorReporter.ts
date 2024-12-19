import { logger } from './Logger';
import type { ErrorContext } from './types';

export class ErrorReporter {
  static report(error: Error, context?: ErrorContext): void {
    const errorContext: ErrorContext = {
      ...context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      }
    };

    // Log to application logger
    logger.error(error.message, errorContext);

    // Log to console in a format that's easy to find in logs
    console.error('=================== ERROR REPORT ===================');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    console.error('Context:', context);
    console.error('Environment:', {
      NODE_ENV: import.meta.env.MODE,
      PROD: import.meta.env.PROD
    });
    console.error('===================================================');
  }

  static captureException(error: unknown, context?: ErrorContext): void {
    if (error instanceof Error) {
      this.report(error, context);
    } else {
      this.report(
        new Error(typeof error === 'string' ? error : 'Unknown error'),
        {
          ...context,
          originalError: error
        }
      );
    }
  }
}
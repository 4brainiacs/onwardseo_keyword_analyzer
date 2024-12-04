```typescript
import { logger } from '../../utils/logger';
import { BaseError } from './types';

interface ErrorContext {
  url?: string;
  requestId?: string;
  component?: string;
  additionalInfo?: Record<string, unknown>;
}

export class ErrorReporter {
  static report(error: Error | BaseError, context?: ErrorContext): void {
    const errorDetails = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof BaseError && {
        status: error.status,
        details: error.details,
        retryable: error.retryable,
        retryAfter: error.retryAfter,
        requestId: error.requestId,
        context: error.context
      }),
      ...context
    };

    logger.error('Application Error:', errorDetails);

    // Log to console in a format that's easy to find in Netlify logs
    console.error('=================== ERROR REPORT ===================');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error:', errorDetails);
    console.error('Context:', context);
    console.error('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      PROD: process.env.NODE_ENV === 'production'
    });
    console.error('===================================================');
  }

  static captureException(error: unknown, context?: ErrorContext): void {
    if (error instanceof Error) {
      this.report(error, context);
    } else {
      this.report(
        new Error(typeof error === 'string' ? error : 'Unknown error'),
        context
      );
    }
  }
}
```
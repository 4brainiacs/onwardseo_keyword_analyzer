export interface LogContext {
  [key: string]: unknown;
}

export interface ErrorContext extends LogContext {
  error?: {
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
  };
  requestId?: string;
  component?: string;
  operation?: string;
}
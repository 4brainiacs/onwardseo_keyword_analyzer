export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  requestId?: string;
}

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
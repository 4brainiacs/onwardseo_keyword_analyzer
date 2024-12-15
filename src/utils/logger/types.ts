export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  requestId?: string;
  component?: string;
}

export interface LogContext {
  [key: string]: any;
}

export interface LogOptions {
  requestId?: string;
  component?: string;
  tags?: string[];
}
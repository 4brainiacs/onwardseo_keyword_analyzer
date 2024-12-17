export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  requestId?: string;
  component?: string;
}

export interface LogOptions {
  requestId?: string;
  component?: string;
  tags?: string[];
}

export interface LogContext {
  [key: string]: unknown;
}
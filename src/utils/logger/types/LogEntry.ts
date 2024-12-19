import type { LogLevel } from './LogLevel';
import type { LogContext } from './LogContext';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  requestId?: string;
}
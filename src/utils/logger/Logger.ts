import type { LogLevel, LogEntry, LogContext } from './types';
import { LogFormatter } from './formatters/LogFormatter';
import { ConsoleTransport } from './transports/ConsoleTransport';

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private readonly isDev = import.meta.env.DEV;
  private readonly consoleTransport: ConsoleTransport;

  private constructor() {
    this.consoleTransport = new ConsoleTransport();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  debug(message: string, context?: LogContext, requestId?: string): void {
    if (this.isDev) {
      this.log('DEBUG', message, context, requestId);
    }
  }

  info(message: string, context?: LogContext, requestId?: string): void {
    this.log('INFO', message, context, requestId);
  }

  warn(message: string, context?: LogContext, requestId?: string): void {
    this.log('WARN', message, context, requestId);
  }

  error(message: string | Error, context?: LogContext, requestId?: string): void {
    const errorMessage = message instanceof Error ? message.message : message;
    const errorContext = message instanceof Error 
      ? { 
          ...context,
          error: {
            name: message.name,
            message: message.message,
            stack: message.stack,
            cause: message.cause
          }
        }
      : context;
    
    this.log('ERROR', errorMessage, errorContext, requestId);
  }

  private log(level: LogLevel, message: string, context?: LogContext, requestId?: string): void {
    const timestamp = new Date().toISOString();
    const sanitizedContext = LogFormatter.sanitizeContext(context);

    const entry: LogEntry = {
      timestamp,
      level,
      message,
      context: sanitizedContext,
      requestId
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.consoleTransport.write(entry);
  }

  getLogs(options: { 
    level?: LogLevel; 
    limit?: number;
    requestId?: string;
    startTime?: Date;
    endTime?: Date;
  } = {}): LogEntry[] {
    let filtered = this.logs;

    if (options.level) {
      filtered = filtered.filter(log => log.level === options.level);
    }
    if (options.requestId) {
      filtered = filtered.filter(log => log.requestId === options.requestId);
    }
    if (options.startTime) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= options.startTime!);
    }
    if (options.endTime) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= options.endTime!);
    }

    return filtered.slice(-(options.limit || 100));
  }

  clearLogs(): void {
    this.logs = [];
  }
}
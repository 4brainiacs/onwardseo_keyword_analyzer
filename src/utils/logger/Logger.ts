import type { LogLevel, LogEntry, LogContext } from './types';

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private readonly isDev = import.meta.env.DEV;

  private constructor() {}

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
    const sanitizedContext = this.sanitizeContext(context);

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

    this.writeToConsole(entry);
  }

  private writeToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] ${entry.level}${entry.requestId ? ` [${entry.requestId}]` : ''}:`;
    const contextStr = entry.context ? `\n${JSON.stringify(entry.context, null, 2)}` : '';
    const message = `${prefix} ${entry.message}${contextStr}`;

    switch (entry.level) {
      case 'ERROR':
        console.error(message);
        break;
      case 'WARN':
        console.warn(message);
        break;
      case 'INFO':
        console.info(message);
        break;
      case 'DEBUG':
        console.debug(message);
        break;
    }
  }

  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    try {
      const sanitized = { ...context };
      const sensitiveKeys = [
        'password', 'token', 'key', 'secret', 'authorization',
        'api_key', 'apiKey', 'auth', 'credentials'
      ];
      
      this.recursiveSanitize(sanitized, sensitiveKeys);
      return sanitized;
    } catch (error) {
      console.error('Error sanitizing log context:', error);
      return { error: 'Error sanitizing log context' };
    }
  }

  private recursiveSanitize(obj: any, sensitiveKeys: string[]): void {
    if (!obj || typeof obj !== 'object') return;

    Object.keys(obj).forEach(key => {
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        this.recursiveSanitize(obj[key], sensitiveKeys);
      }
    });
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

export const logger = Logger.getInstance();
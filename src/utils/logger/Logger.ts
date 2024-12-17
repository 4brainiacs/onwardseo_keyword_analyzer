import type { LogLevel, LogEntry, LogOptions } from './types';

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

  debug(message: string, data?: Record<string, unknown>, options?: LogOptions): void {
    if (this.isDev) {
      this.log('DEBUG', message, data, options);
    }
  }

  info(message: string, data?: Record<string, unknown>, options?: LogOptions): void {
    this.log('INFO', message, data, options);
  }

  warn(message: string, data?: Record<string, unknown>, options?: LogOptions): void {
    this.log('WARN', message, data, options);
  }

  error(message: string | Error, data?: Record<string, unknown>, options?: LogOptions): void {
    const errorMessage = message instanceof Error ? message.message : message;
    const errorData = message instanceof Error 
      ? { 
          ...data, 
          error: {
            name: message.name,
            message: message.message,
            stack: message.stack
          }
        }
      : data;
    
    this.log('ERROR', errorMessage, errorData, options);
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>, options: LogOptions = {}): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.sanitizeData(data),
      requestId: options.requestId,
      component: options.component
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    const consoleMessage = `[${entry.timestamp}] ${level}: ${message}${
      entry.context ? '\n' + JSON.stringify(entry.context, null, 2) : ''
    }`;

    switch (level) {
      case 'ERROR':
        console.error(consoleMessage);
        break;
      case 'WARN':
        console.warn(consoleMessage);
        break;
      case 'INFO':
        console.info(consoleMessage);
        break;
      case 'DEBUG':
        console.debug(consoleMessage);
        break;
    }
  }

  private sanitizeData(data?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!data) return undefined;

    try {
      const sanitized = { ...data };
      const sensitiveKeys = [
        'password', 'token', 'key', 'secret', 'authorization',
        'api_key', 'apiKey', 'auth'
      ];
      
      Object.keys(sanitized).forEach(key => {
        if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
          sanitized[key] = '[REDACTED]';
        }
      });

      return sanitized;
    } catch {
      return { error: '[Error sanitizing log data]' };
    }
  }

  getLogs(level?: LogLevel, limit = 100): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = this.logs.filter(log => log.level === level);
    }
    return filtered.slice(-limit);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
import { LogLevel, LogEntry, LogContext } from './types';

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private readonly isDev = process.env.NODE_ENV === 'development';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  debug(message: string, context?: LogContext) {
    if (this.isDev) {
      this.log('DEBUG', message, context);
    }
  }

  info(message: string, context?: LogContext) {
    this.log('INFO', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('WARN', message, context);
  }

  error(message: string | Error, context?: LogContext) {
    const errorMessage = message instanceof Error ? message.message : message;
    const errorContext = message instanceof Error 
      ? { 
          ...context,
          error: {
            name: message.name,
            message: message.message,
            stack: message.stack,
            ...(message as any).toJSON?.()
          }
        }
      : context;

    this.log('ERROR', errorMessage, errorContext);
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.sanitizeContext(context)
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.writeToConsole(entry);
  }

  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth'];

    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private writeToConsole(entry: LogEntry) {
    const message = `[${entry.timestamp}] ${entry.level}: ${entry.message}`;
    const context = entry.context ? `\n${JSON.stringify(entry.context, null, 2)}` : '';

    switch (entry.level) {
      case 'ERROR':
        console.error(message + context);
        break;
      case 'WARN':
        console.warn(message + context);
        break;
      case 'INFO':
        console.info(message + context);
        break;
      case 'DEBUG':
        console.debug(message + context);
        break;
    }
  }
}

export const logger = Logger.getInstance();
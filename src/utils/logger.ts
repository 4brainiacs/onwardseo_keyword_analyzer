type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private readonly isDev = process.env.NODE_ENV === 'development';

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  debug(message: string, data?: any) {
    if (this.isDev) {
      this.log('DEBUG', message, data);
    }
  }

  info(message: string, data?: any) {
    this.log('INFO', message, data);
  }

  warn(message: string, data?: any) {
    this.log('WARN', message, data);
  }

  error(message: string | Error, data?: any) {
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
    
    this.log('ERROR', errorMessage, errorData);
  }

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const sanitizedData = this.sanitizeData(data);
    
    const entry: LogEntry = {
      timestamp,
      level,
      message,
      data: sanitizedData
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    const consoleMessage = `[${timestamp}] ${level}: ${message}${
      sanitizedData ? '\n' + JSON.stringify(sanitizedData, null, 2) : ''
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

  private sanitizeData(data: any): any {
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
      return '[Error sanitizing log data]';
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
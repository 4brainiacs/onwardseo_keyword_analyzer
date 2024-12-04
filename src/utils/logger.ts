type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private readonly isDev = process.env.NODE_ENV === 'development';

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
            stack: message.stack,
            ...(message as any).toJSON?.()
          }
        }
      : data;
    
    this.log('ERROR', errorMessage, errorData);
  }

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const sanitizedData = this.sanitizeData(data);
    
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      data: sanitizedData
    };
    
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    const consoleData = sanitizedData ? 
      '\n' + JSON.stringify(sanitizedData, null, 2) : '';
      
    const consoleMessage = `[${timestamp}] ${level}: ${message}${consoleData}`;

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
      default:
        console.log(consoleMessage);
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

export const logger = new Logger();
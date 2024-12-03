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

  debug(message: string, data?: any) {
    this.log('DEBUG', message, data);
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
            message: message.message,
            stack: message.stack
          }
        }
      : data;
    
    this.log('ERROR', errorMessage, errorData);
  }

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      data: this.sanitizeData(data)
    };
    
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    const consoleMessage = `[${timestamp}] ${level}: ${message}`;
    switch (level) {
      case 'ERROR':
        console.error(consoleMessage, data || '');
        break;
      case 'WARN':
        console.warn(consoleMessage, data || '');
        break;
      case 'INFO':
        console.info(consoleMessage, data || '');
        break;
      default:
        console.log(consoleMessage, data || '');
    }
  }

  private sanitizeData(data: any): any {
    if (!data) return undefined;

    try {
      const sanitized = { ...data };
      const sensitiveKeys = ['password', 'token', 'key', 'secret', 'authorization'];
      
      Object.keys(sanitized).forEach(key => {
        if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
          sanitized[key] = '[REDACTED]';
        }
      });

      return sanitized;
    } catch (error) {
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
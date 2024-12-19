import type { LogEntry, LogContext } from '../types/LogEntry';

export class LogFormatter {
  static formatLogEntry(entry: LogEntry): string {
    const prefix = this.formatPrefix(entry);
    const context = this.formatContext(entry.context);
    return `${prefix} ${entry.message}${context}`;
  }

  private static formatPrefix(entry: LogEntry): string {
    const requestId = entry.requestId ? ` [${entry.requestId}]` : '';
    return `[${entry.timestamp}] ${entry.level}${requestId}:`;
  }

  private static formatContext(context?: LogContext): string {
    if (!context) return '';
    return `\n${JSON.stringify(this.sanitizeContext(context), null, 2)}`;
  }

  static sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    try {
      const sanitized = { ...context };
      const sensitiveKeys = [
        'password', 'token', 'key', 'secret', 'authorization',
        'api_key', 'apiKey', 'auth', 'credentials'
      ];
      
      return this.recursiveSanitize(sanitized, sensitiveKeys);
    } catch (error) {
      console.error('Error sanitizing log context:', error);
      return { error: 'Error sanitizing log context' };
    }
  }

  private static recursiveSanitize(obj: any, sensitiveKeys: string[]): any {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized = { ...obj };
    for (const key in sanitized) {
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.recursiveSanitize(sanitized[key], sensitiveKeys);
      }
    }
    return sanitized;
  }
}
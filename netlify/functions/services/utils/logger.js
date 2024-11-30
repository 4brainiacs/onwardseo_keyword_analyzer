export class Logger {
  info(message, data = {}) {
    this.log('INFO', message, data);
  }

  error(message, data = {}) {
    this.log('ERROR', message, data);
  }

  warn(message, data = {}) {
    this.log('WARN', message, data);
  }

  debug(message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, data);
    }
  }

  private log(level, message, data) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...this.sanitizeData(data)
    };

    // Always log to console for Netlify logging
    console.log(JSON.stringify(logData));
  }

  private sanitizeData(data) {
    if (!data) return {};

    const sanitized = { ...data };
    const sensitiveKeys = ['api_key', 'key', 'token', 'password', 'secret'];

    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}

export const logger = new Logger();
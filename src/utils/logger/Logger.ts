export class Logger {
  private static instance: Logger;
  
  private constructor() {}
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string, data?: Record<string, unknown>) {
    this.log('INFO', message, data);
  }

  error(message: string, error?: unknown, data?: Record<string, unknown>) {
    this.log('ERROR', message, { error, ...data });
  }

  private log(level: string, message: string, data?: Record<string, unknown>) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    }));
  }
}

export const logger = Logger.getInstance();
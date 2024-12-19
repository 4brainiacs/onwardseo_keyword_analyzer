export { logger } from './Logger';
export type { LogLevel, LogEntry, LogContext } from './types';

// Create singleton instance
const logger = Logger.getInstance();
export { logger };
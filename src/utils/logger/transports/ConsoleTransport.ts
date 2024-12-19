import { BaseTransport } from './BaseTransport';
import type { LogEntry } from '../types/LogEntry';
import { LogFormatter } from '../formatters/LogFormatter';

export class ConsoleTransport extends BaseTransport {
  write(entry: LogEntry): void {
    const formattedMessage = LogFormatter.formatLogEntry(entry);

    switch (entry.level) {
      case 'ERROR':
        console.error(formattedMessage);
        break;
      case 'WARN':
        console.warn(formattedMessage);
        break;
      case 'INFO':
        console.info(formattedMessage);
        break;
      case 'DEBUG':
        console.debug(formattedMessage);
        break;
    }
  }
}
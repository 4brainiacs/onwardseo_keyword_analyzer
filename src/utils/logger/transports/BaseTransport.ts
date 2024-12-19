import type { LogEntry } from '../types/LogEntry';

export abstract class BaseTransport {
  abstract write(entry: LogEntry): void;
}
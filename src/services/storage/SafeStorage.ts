import { logger } from '../../utils/logger';

export class SafeStorage {
  private memoryFallback: Map<string, string>;

  constructor() {
    this.memoryFallback = new Map();
  }

  get<T>(key: string): T | null {
    try {
      const value = this.memoryFallback.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Storage get error:', { key, error });
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      this.memoryFallback.set(key, JSON.stringify(value));
    } catch (error) {
      logger.error('Storage set error:', { key, error });
    }
  }

  remove(key: string): void {
    this.memoryFallback.delete(key);
  }

  clear(): void {
    this.memoryFallback.clear();
  }
}

export const storage = new SafeStorage();
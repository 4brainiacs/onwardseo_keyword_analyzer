import { logger } from '../../utils/logger';

/**
 * Memory-only storage implementation that doesn't rely on localStorage
 */
export class MemoryStorage {
  private static instance: MemoryStorage;
  private storage: Map<string, string>;

  private constructor() {
    this.storage = new Map();
  }

  static getInstance(): MemoryStorage {
    if (!MemoryStorage.instance) {
      MemoryStorage.instance = new MemoryStorage();
    }
    return MemoryStorage.instance;
  }

  getItem<T>(key: string): T | null {
    try {
      const value = this.storage.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Memory storage get error:', { key, error });
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      this.storage.set(key, JSON.stringify(value));
    } catch (error) {
      logger.error('Memory storage set error:', { key, error });
    }
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

export const memoryStorage = MemoryStorage.getInstance();
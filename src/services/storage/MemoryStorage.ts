import { logger } from '../../utils/logger';

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

  get<T>(key: string): T | null {
    try {
      const value = this.storage.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.warn('Memory storage get failed:', { key, error });
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      this.storage.set(key, JSON.stringify(value));
    } catch (error) {
      logger.warn('Memory storage set failed:', { key, error });
    }
  }

  remove(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

export const memoryStorage = MemoryStorage.getInstance();
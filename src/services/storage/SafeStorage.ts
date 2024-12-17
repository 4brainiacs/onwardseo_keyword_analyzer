import { logger } from '../../utils/logger';

export class SafeStorage {
  private memoryStorage = new Map<string, string>();

  constructor(private prefix: string = 'app_') {}

  get<T>(key: string): T | null {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const value = this.memoryStorage.get(prefixedKey);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Storage get error:', { key, error });
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const serializedValue = JSON.stringify(value);
      this.memoryStorage.set(prefixedKey, serializedValue);
    } catch (error) {
      logger.error('Storage set error:', { key, error });
    }
  }

  remove(key: string): void {
    const prefixedKey = this.getPrefixedKey(key);
    this.memoryStorage.delete(prefixedKey);
  }

  clear(): void {
    this.memoryStorage.clear();
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

export const storage = new SafeStorage('seo_analyzer_');
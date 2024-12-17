import { logger } from '../../utils/logger';

export class StorageService {
  private readonly prefix: string;
  private readonly memoryFallback: Map<string, string>;
  private readonly isStorageAvailable: boolean;

  constructor(prefix = 'app_') {
    this.prefix = prefix;
    this.memoryFallback = new Map();
    this.isStorageAvailable = this.checkStorageAvailability();
  }

  private checkStorageAvailability(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const testKey = `${this.prefix}test`;
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      logger.warn('LocalStorage is not available, using memory fallback');
      return false;
    }
  }

  get<T>(key: string): T | null {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const value = this.isStorageAvailable
        ? window.localStorage.getItem(prefixedKey)
        : this.memoryFallback.get(prefixedKey);

      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Failed to get item from storage:', { key, error });
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const serializedValue = JSON.stringify(value);

      if (this.isStorageAvailable) {
        window.localStorage.setItem(prefixedKey, serializedValue);
      } else {
        this.memoryFallback.set(prefixedKey, serializedValue);
      }
    } catch (error) {
      logger.error('Failed to set item in storage:', { key, error });
    }
  }

  remove(key: string): void {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      if (this.isStorageAvailable) {
        window.localStorage.removeItem(prefixedKey);
      }
      this.memoryFallback.delete(prefixedKey);
    } catch (error) {
      logger.error('Failed to remove item from storage:', { key, error });
    }
  }

  clear(): void {
    try {
      if (this.isStorageAvailable) {
        Object.keys(window.localStorage)
          .filter(key => key.startsWith(this.prefix))
          .forEach(key => window.localStorage.removeItem(key));
      }
      this.memoryFallback.clear();
    } catch (error) {
      logger.error('Failed to clear storage:', error);
    }
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

export const storage = new StorageService();
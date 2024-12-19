import { logger } from '../logger';

export interface StorageOptions {
  fallbackToMemory?: boolean;
  prefix?: string;
}

export class SafeStorage {
  private memoryStorage: Map<string, string>;
  private prefix: string;
  private isStorageAvailable: boolean;

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || 'app_';
    this.memoryStorage = new Map();
    this.isStorageAvailable = this.checkStorageAvailability();
    
    if (!this.isStorageAvailable) {
      logger.info('Browser storage not available, using memory fallback');
    }
  }

  get<T>(key: string): T | null {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const value = this.isStorageAvailable 
        ? window.localStorage.getItem(prefixedKey)
        : this.memoryStorage.get(prefixedKey);
      
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

      if (this.isStorageAvailable) {
        window.localStorage.setItem(prefixedKey, serializedValue);
      } else {
        this.memoryStorage.set(prefixedKey, serializedValue);
      }
    } catch (error) {
      logger.error('Storage set error:', { key, error });
    }
  }

  remove(key: string): void {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      if (this.isStorageAvailable) {
        window.localStorage.removeItem(prefixedKey);
      }
      this.memoryStorage.delete(prefixedKey);
    } catch (error) {
      logger.error('Storage remove error:', { key, error });
    }
  }

  clear(): void {
    try {
      if (this.isStorageAvailable) {
        Object.keys(window.localStorage)
          .filter(key => key.startsWith(this.prefix))
          .forEach(key => window.localStorage.removeItem(key));
      }
      this.memoryStorage.clear();
    } catch (error) {
      logger.error('Storage clear error:', error);
    }
  }

  private checkStorageAvailability(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const testKey = `${this.prefix}test`;
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

export const storage = new SafeStorage({
  fallbackToMemory: true,
  prefix: 'seo_analyzer_'
});
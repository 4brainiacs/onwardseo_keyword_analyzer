import { logger } from '../logger';

interface StorageOptions {
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

    if (!this.isStorageAvailable && options.fallbackToMemory) {
      logger.warn('LocalStorage not available, using memory storage fallback');
    }
  }

  private checkStorageAvailability(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      const testKey = `${this.prefix}_test`;
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      
      if (this.isStorageAvailable) {
        const item = localStorage.getItem(prefixedKey);
        return item ? JSON.parse(item) : null;
      }
      
      const item = this.memoryStorage.get(prefixedKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      logger.error('Storage get error:', { key, error });
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const serializedValue = JSON.stringify(value);

      if (this.isStorageAvailable) {
        localStorage.setItem(prefixedKey, serializedValue);
      } else {
        this.memoryStorage.set(prefixedKey, serializedValue);
      }
    } catch (error) {
      logger.error('Storage set error:', { key, error });
      // Fallback to memory storage on error
      this.memoryStorage.set(this.getPrefixedKey(key), JSON.stringify(value));
    }
  }

  removeItem(key: string): void {
    const prefixedKey = this.getPrefixedKey(key);
    
    if (this.isStorageAvailable) {
      try {
        localStorage.removeItem(prefixedKey);
      } catch (error) {
        logger.error('Storage remove error:', { key, error });
      }
    }
    
    this.memoryStorage.delete(prefixedKey);
  }

  clear(): void {
    if (this.isStorageAvailable) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(this.prefix)) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        logger.error('Storage clear error:', error);
      }
    }
    
    this.memoryStorage.clear();
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

// Create singleton instance with default options
export const storage = new SafeStorage({
  fallbackToMemory: true,
  prefix: 'seo_analyzer_'
});
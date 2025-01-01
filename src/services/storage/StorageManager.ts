import { logger } from '../../utils/logger';
import { validateKey, validateValue } from './utils/validation';
import { STORAGE_DEFAULTS } from './constants';
import type { StorageOptions, StorageStats } from './types';

export class StorageManager {
  private memoryStorage: Map<string, string>;
  private prefix: string;
  private storageType: 'local' | 'memory';

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || STORAGE_DEFAULTS.PREFIX;
    this.memoryStorage = new Map();
    this.storageType = this.detectStorageAvailability(options.fallbackToMemory);
    
    logger.info(`Using ${this.storageType} storage`);
  }

  get<T>(key: string): T | null {
    const validation = validateKey(key);
    if (!validation.isValid) {
      logger.warn('Invalid storage key:', validation.error);
      return null;
    }

    try {
      const prefixedKey = this.getPrefixedKey(key);
      const value = this.storageType === 'local' 
        ? localStorage.getItem(prefixedKey)
        : this.memoryStorage.get(prefixedKey);

      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.warn('Storage get failed:', { key, error });
      return null;
    }
  }

  set<T>(key: string, value: T): boolean {
    const keyValidation = validateKey(key);
    if (!keyValidation.isValid) {
      logger.warn('Invalid storage key:', keyValidation.error);
      return false;
    }

    const valueValidation = validateValue(value);
    if (!valueValidation.isValid) {
      logger.warn('Invalid storage value:', valueValidation.error);
      return false;
    }

    try {
      const prefixedKey = this.getPrefixedKey(key);
      const serializedValue = JSON.stringify(value);

      if (this.storageType === 'local') {
        localStorage.setItem(prefixedKey, serializedValue);
      } else {
        this.memoryStorage.set(prefixedKey, serializedValue);
      }
      return true;
    } catch (error) {
      logger.warn('Storage set failed:', { key, error });
      return false;
    }
  }

  remove(key: string): boolean {
    const validation = validateKey(key);
    if (!validation.isValid) {
      logger.warn('Invalid storage key:', validation.error);
      return false;
    }

    try {
      const prefixedKey = this.getPrefixedKey(key);
      if (this.storageType === 'local') {
        localStorage.removeItem(prefixedKey);
      } else {
        this.memoryStorage.delete(prefixedKey);
      }
      return true;
    } catch (error) {
      logger.warn('Storage remove failed:', { key, error });
      return false;
    }
  }

  clear(): boolean {
    try {
      if (this.storageType === 'local') {
        Object.keys(localStorage)
          .filter(key => key.startsWith(this.prefix))
          .forEach(key => localStorage.removeItem(key));
      } else {
        this.memoryStorage.clear();
      }
      return true;
    } catch (error) {
      logger.warn('Storage clear failed:', error);
      return false;
    }
  }

  getStats(): StorageStats {
    const items = this.storageType === 'local'
      ? Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      : Array.from(this.memoryStorage.keys());

    return {
      type: this.storageType,
      itemCount: items.length,
      oldestItem: items.length > 0 ? new Date() : undefined,
      newestItem: items.length > 0 ? new Date() : undefined
    };
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private detectStorageAvailability(fallbackToMemory: boolean = true): 'local' | 'memory' {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return 'memory';
      }

      const testKey = `${this.prefix}test`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return 'local';
    } catch (error) {
      if (fallbackToMemory) {
        logger.info('localStorage not available, using memory storage');
        return 'memory';
      }
      throw new Error('Storage is not available in this context');
    }
  }
}
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

  // ... rest of the implementation
}
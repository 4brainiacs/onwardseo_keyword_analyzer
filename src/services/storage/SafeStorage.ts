import { logger } from '../../utils/logger';

export class SafeStorage {
  private static instance: SafeStorage;
  private isAvailable: boolean;

  private constructor() {
    this.isAvailable = this.checkStorageAvailability();
  }

  static getInstance(): SafeStorage {
    if (!SafeStorage.instance) {
      SafeStorage.instance = new SafeStorage();
    }
    return SafeStorage.instance;
  }

  private checkStorageAvailability(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const storage = window.localStorage;
      const testKey = '__storage_test__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch {
      logger.warn('Local storage is not available');
      return false;
    }
  }

  getItem<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      logger.error('Failed to read from storage:', error);
      return defaultValue;
    }
  }

  setItem(key: string, value: unknown): void {
    if (!this.isAvailable) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      logger.error('Failed to write to storage:', error);
    }
  }

  removeItem(key: string): void {
    if (!this.isAvailable) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.error('Failed to remove from storage:', error);
    }
  }

  clear(): void {
    if (!this.isAvailable) return;

    try {
      localStorage.clear();
    } catch (error) {
      logger.error('Failed to clear storage:', error);
    }
  }
}

export const storage = SafeStorage.getInstance();
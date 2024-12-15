import { logger } from '../logger';

export class SafeStorage {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = this.checkStorageAvailability();
  }

  private checkStorageAvailability(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      // Test storage access
      const storage = window.localStorage;
      const testKey = '__storage_test__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key: string): string | null {
    if (!this.isAvailable) {
      logger.warn('Storage is not accessible');
      return null;
    }

    try {
      return localStorage.getItem(key);
    } catch (error) {
      logger.error('Failed to read from storage:', error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    if (!this.isAvailable) {
      logger.warn('Storage is not accessible');
      return;
    }

    try {
      localStorage.setItem(key, value);
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
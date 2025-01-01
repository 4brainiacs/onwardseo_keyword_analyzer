import { MemoryStorage } from './MemoryStorage';
import { SafeStorage } from './SafeStorage';
import { logger } from '../logger';

export class StorageFactory {
  static create(prefix: string = 'app_'): MemoryStorage | SafeStorage {
    // Always use memory storage in non-browser environments
    if (typeof window === 'undefined') {
      return new MemoryStorage();
    }

    try {
      // Test localStorage availability
      const storage = new SafeStorage({ prefix });
      const testKey = `${prefix}test`;
      storage.set(testKey, 'test');
      storage.remove(testKey);
      return storage;
    } catch (error) {
      logger.info('Browser storage not available, using memory storage');
      return new MemoryStorage();
    }
  }
}
import { MemoryStorage } from './MemoryStorage';
import { SafeStorage } from './SafeStorage';
import { logger } from '../logger';

// Create singleton storage instance
let storage: SafeStorage | MemoryStorage;

try {
  storage = new SafeStorage({
    prefix: 'seo_analyzer_'
  });
} catch (error) {
  logger.info('Using memory storage fallback');
  storage = new MemoryStorage();
}

export { storage };
export type { StorageOptions } from './SafeStorage';
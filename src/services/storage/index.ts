import { MemoryStorage } from './MemoryStorage';
import { logger } from '../logger';

// Create singleton storage instance
const storage = MemoryStorage.getInstance();

export { storage };
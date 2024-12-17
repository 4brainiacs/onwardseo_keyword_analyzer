import { SafeStorage } from './SafeStorage';

// Create a singleton instance with default options
const storage = new SafeStorage({
  fallbackToMemory: true,
  prefix: 'seo_analyzer_'
});

export { storage, SafeStorage };
export type { StorageOptions } from './SafeStorage';
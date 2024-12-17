import { SafeStorage } from './SafeStorage';
export { SafeStorage };
export type { StorageOptions } from './SafeStorage';

// Create singleton instance
export const storage = new SafeStorage({
  fallbackToMemory: true,
  prefix: 'seo_analyzer_'
});
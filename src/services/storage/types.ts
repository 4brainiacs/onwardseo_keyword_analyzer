export interface StorageValue<T = unknown> {
  data: T;
  timestamp: number;
  expires?: number;
}

export interface StorageOptions {
  prefix?: string;
  fallbackToMemory?: boolean;
  defaultTTL?: number;
}

export interface StorageStats {
  type: 'local' | 'memory';
  itemCount: number;
  oldestItem?: Date;
  newestItem?: Date;
}
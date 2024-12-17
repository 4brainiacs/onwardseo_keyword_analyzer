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

  // ... rest of the implementation
}

export type { StorageOptions };
import { logger } from '../../utils/logger';

interface CacheOptions {
  ttl: number;
  maxSize: number;
  cleanupInterval: number;
  maxMemoryUsage: number; // in bytes
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  size: number;
}

export class CacheService<T> {
  private cache: Map<string, CacheEntry<T>>;
  private options: CacheOptions;
  private cleanupInterval: ReturnType<typeof setInterval>;
  private currentSize: number = 0;

  constructor(options: Partial<CacheOptions> = {}) {
    this.cache = new Map();
    this.options = {
      ttl: options.ttl || 3600000, // 1 hour default
      maxSize: options.maxSize || 100,
      cleanupInterval: options.cleanupInterval || 300000, // 5 minutes
      maxMemoryUsage: options.maxMemoryUsage || 50 * 1024 * 1024 // 50MB default
    };

    this.cleanupInterval = this.startCleanupInterval();
  }

  public set(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const size = this.calculateSize(value);

    // Check if adding this item would exceed memory limit
    if (this.currentSize + size > this.options.maxMemoryUsage) {
      this.cleanup(true); // Force cleanup
      if (this.currentSize + size > this.options.maxMemoryUsage) {
        logger.warn('Cache memory limit exceeded, item not cached', {
          key,
          size,
          currentSize: this.currentSize,
          maxSize: this.options.maxMemoryUsage
        });
        return;
      }
    }

    const entry: CacheEntry<T> = {
      data: value,
      timestamp: now,
      expiresAt: now + (ttl || this.options.ttl),
      size
    };

    // Remove old entry if exists
    const oldEntry = this.cache.get(key);
    if (oldEntry) {
      this.currentSize -= oldEntry.size;
    }

    this.cache.set(key, entry);
    this.currentSize += size;

    if (this.cache.size > this.options.maxSize) {
      this.evictOldest();
    }
  }

  public get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  public delete(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentSize -= entry.size;
      this.cache.delete(key);
    }
  }

  public clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }

  private startCleanupInterval(): ReturnType<typeof setInterval> {
    return setInterval(() => {
      this.cleanup();
    }, this.options.cleanupInterval);
  }

  public stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  private cleanup(force: boolean = false): void {
    const now = Date.now();
    const memoryThreshold = this.options.maxMemoryUsage * 0.9; // 90% of max

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt || (force && this.currentSize > memoryThreshold)) {
        this.delete(key);
      }
    }
  }

  private calculateSize(value: T): number {
    try {
      const str = JSON.stringify(value);
      return str.length * 2; // Approximate size in bytes (UTF-16)
    } catch {
      return 1024; // Default size if can't calculate
    }
  }

  private evictOldest(): void {
    let oldest: [string, CacheEntry<T>] | null = null;
    
    for (const entry of this.cache.entries()) {
      if (!oldest || entry[1].timestamp < oldest[1].timestamp) {
        oldest = entry;
      }
    }

    if (oldest) {
      this.delete(oldest[0]);
    }
  }

  public getStats(): {
    size: number;
    itemCount: number;
    memoryUsage: number;
    maxMemory: number;
  } {
    return {
      size: this.currentSize,
      itemCount: this.cache.size,
      memoryUsage: this.currentSize,
      maxMemory: this.options.maxMemoryUsage
    };
  }
}
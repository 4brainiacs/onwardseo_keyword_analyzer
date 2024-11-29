interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class CacheService {
  private storage = new Map<string, CacheEntry<any>>();
  private maxSize = 100;

  async get<T>(key: string): Promise<T | null> {
    const entry = this.storage.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.timestamp + entry.ttl) {
      this.storage.delete(key);
      return null;
    }

    return entry.value;
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    this.storage.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });

    if (this.storage.size > this.maxSize) {
      this.cleanup();
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.storage.entries());
    
    // Sort by timestamp (oldest first)
    entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
    
    // Remove oldest entries until we're under maxSize
    while (entries.length > this.maxSize) {
      const [key] = entries.shift()!;
      this.storage.delete(key);
    }

    // Also remove expired entries
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.storage.delete(key);
      }
    }
  }

  clear(): void {
    this.storage.clear();
  }
}

export const cache = new CacheService();
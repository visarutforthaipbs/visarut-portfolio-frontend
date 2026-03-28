// Simple in-memory cache for WordPress API responses with LRU eviction
class APICache {
  private cache = new Map<
    string,
    { data: unknown; timestamp: number; ttl: number }
  >();
  private readonly maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  set(key: string, data: unknown, ttlMinutes: number = 5): void {
    const ttl = ttlMinutes * 60 * 1000;

    // If key already exists, delete to refresh insertion order
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Evict oldest entries if at capacity
    while (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if cache has expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, cached);

    return cached.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Create singleton instance
export const apiCache = new APICache();

// Cleanup expired entries every 10 minutes
setInterval(() => {
  apiCache.cleanup();
}, 10 * 60 * 1000);

export default apiCache;

// lib/cache.ts
type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
};

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check if entry has expired
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Default TTL: 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cache = new SimpleCache();

// ✅ Helper function for cached database queries
export async function cachedQuery<T>(
  key: string,
  query: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key);
  if (cached) {
    console.log(`✅ Cache hit for: ${key}`);
    return cached;
  }
  
  console.log(`🔄 Cache miss for: ${key}, executing query...`);
  
  // Execute query and cache result
  const result = await query();
  cache.set(key, result, ttl);
  
  return result;
}
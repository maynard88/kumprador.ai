export interface CachedPriceData {
  data: any[];
  timestamp: number;
  region: string;
  count: number;
}

export class PriceDataCache {
  private static instance: PriceDataCache;
  private cache: Map<string, CachedPriceData> = new Map();
  private readonly CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

  private constructor() {}

  public static getInstance(): PriceDataCache {
    if (!PriceDataCache.instance) {
      PriceDataCache.instance = new PriceDataCache();
    }
    return PriceDataCache.instance;
  }

  private generateKey(region: string, count: number): string {
    return `price_data_${region}_${count}`;
  }

  public get(region: string, count: number): any[] | null {
    const key = this.generateKey(region, count);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if cache has expired
    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  public set(region: string, count: number, data: any[]): void {
    const key = this.generateKey(region, count);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      region,
      count
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public clearExpired(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.CACHE_TTL_MS) {
        this.cache.delete(key);
      }
    }
  }

  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

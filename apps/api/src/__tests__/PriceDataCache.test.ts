import { PriceDataCache } from '../infrastructure/cache/PriceDataCache';

describe('PriceDataCache', () => {
  let cache: PriceDataCache;

  beforeEach(() => {
    cache = PriceDataCache.getInstance();
    cache.clear(); // Clear cache before each test
  });

  afterEach(() => {
    cache.clear();
  });

  describe('get and set', () => {
    it('should store and retrieve data correctly', () => {
      const testData = [
        { commodity: 'Rice', price: 50 },
        { commodity: 'Fish', price: 100 }
      ];
      const region = '070000000';
      const count = 23;

      // Initially should return null
      expect(cache.get(region, count)).toBeNull();

      // Set data
      cache.set(region, count, testData);

      // Should retrieve the same data
      const retrieved = cache.get(region, count);
      expect(retrieved).toEqual(testData);
    });

    it('should return null for different region/count combinations', () => {
      const testData = [{ commodity: 'Rice', price: 50 }];
      const region = '070000000';
      const count = 23;

      cache.set(region, count, testData);

      // Different region should return null
      expect(cache.get('080000000', count)).toBeNull();
      
      // Different count should return null
      expect(cache.get(region, 50)).toBeNull();
    });
  });

  describe('cache expiration', () => {
    it('should return null for expired cache entries', (done) => {
      const testData = [{ commodity: 'Rice', price: 50 }];
      const region = '070000000';
      const count = 23;

      cache.set(region, count, testData);

      // Mock Date.now to simulate time passing
      const originalNow = Date.now;
      const mockNow = jest.fn();
      
      // First call returns current time, second call returns time after TTL
      mockNow
        .mockReturnValueOnce(originalNow())
        .mockReturnValueOnce(originalNow() + 31 * 60 * 1000); // 31 minutes later
      
      Date.now = mockNow;

      // Should still have data initially
      expect(cache.get(region, count)).toEqual(testData);

      // After time passes, should return null
      expect(cache.get(region, count)).toBeNull();

      Date.now = originalNow;
      done();
    });
  });

  describe('cache stats', () => {
    it('should return correct cache statistics', () => {
      const testData = [{ commodity: 'Rice', price: 50 }];
      
      cache.set('070000000', 23, testData);
      cache.set('080000000', 25, testData);

      const stats = cache.getCacheStats();
      
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('price_data_070000000_23');
      expect(stats.keys).toContain('price_data_080000000_25');
    });
  });

  describe('clear methods', () => {
    it('should clear all cache entries', () => {
      const testData = [{ commodity: 'Rice', price: 50 }];
      
      cache.set('070000000', 23, testData);
      cache.set('080000000', 25, testData);

      expect(cache.getCacheStats().size).toBe(2);

      cache.clear();

      expect(cache.getCacheStats().size).toBe(0);
    });

    it('should clear only expired entries', () => {
      const testData = [{ commodity: 'Rice', price: 50 }];
      
      // Set two entries
      cache.set('070000000', 23, testData);
      cache.set('080000000', 25, testData);

      expect(cache.getCacheStats().size).toBe(2);

      // clearExpired should not remove any entries since they're not expired
      cache.clearExpired();

      expect(cache.getCacheStats().size).toBe(2);
      expect(cache.get('070000000', 23)).toEqual(testData);
      expect(cache.get('080000000', 25)).toEqual(testData);
    });
  });
});

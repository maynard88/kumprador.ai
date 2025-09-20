import {
  REGION_VII_MARKETS,
  MARKET_DATA,
  getMarketsForRegion,
  getAvailableRegions,
  isMarketInRegion,
  createMarketsFromNames,
  getMarketEntitiesForRegion,
} from '../config/marketData';
import { Market } from '../domain/entities/Market';

describe('Market Data Configuration', () => {
  describe('REGION_VII_MARKETS', () => {
    it('should contain all expected market names', () => {
      const expectedMarkets = [
        'TABUNOK PUBLIC MARKET',
        'MANDAUE CITY PUBLIC MARKET',
        'LAPU LAPU CITY PUBLIC MARKET',
        'LAZI PUBLIC MARKET',
        'DAO PUBLIC MARKET',
        'DUMAGUETE CITY PUBLIC MARKET',
        'CARBON PASIL MARKET',
        'LARENA PUBLIC MARKET',
        'SIQUIJOR PUBLIC MARKET',
        'PASIL PUBLIC MARKET',
      ];

      expect(REGION_VII_MARKETS).toEqual(expectedMarkets);
      expect(REGION_VII_MARKETS).toHaveLength(10);
    });
  });

  describe('MARKET_DATA', () => {
    it('should contain Region VII markets', () => {
      expect(MARKET_DATA['Region VII']).toEqual(REGION_VII_MARKETS);
    });

    it('should be readonly', () => {
      expect(() => {
        // This should cause a TypeScript error if the object is properly readonly
        (MARKET_DATA as any)['Region VII'] = [];
      }).toThrow();
    });
  });

  describe('getMarketsForRegion', () => {
    it('should return markets for Region VII', () => {
      const markets = getMarketsForRegion('Region VII');
      expect(markets).toEqual(REGION_VII_MARKETS);
    });

    it('should return empty array for unknown region', () => {
      const markets = getMarketsForRegion('Unknown Region');
      expect(markets).toEqual([]);
    });
  });

  describe('getAvailableRegions', () => {
    it('should return all available regions', () => {
      const regions = getAvailableRegions();
      expect(regions).toContain('Region VII');
      expect(regions).toHaveLength(1); // Only Region VII is currently defined
    });
  });

  describe('isMarketInRegion', () => {
    it('should return true for valid market in Region VII', () => {
      expect(isMarketInRegion('TABUNOK PUBLIC MARKET', 'Region VII')).toBe(true);
      expect(isMarketInRegion('MANDAUE CITY PUBLIC MARKET', 'Region VII')).toBe(true);
    });

    it('should return false for invalid market in Region VII', () => {
      expect(isMarketInRegion('INVALID MARKET', 'Region VII')).toBe(false);
    });

    it('should return false for valid market in unknown region', () => {
      expect(isMarketInRegion('TABUNOK PUBLIC MARKET', 'Unknown Region')).toBe(false);
    });
  });

  describe('createMarketsFromNames', () => {
    it('should create Market entities from market names', () => {
      const marketNames = ['TABUNOK PUBLIC MARKET', 'MANDAUE CITY PUBLIC MARKET'];
      const markets = createMarketsFromNames(marketNames);

      expect(markets).toHaveLength(2);
      expect(markets[0]).toBeInstanceOf(Market);
      expect(markets[0].name).toBe('TABUNOK PUBLIC MARKET');
      expect(markets[1].name).toBe('MANDAUE CITY PUBLIC MARKET');
    });

    it('should handle empty array', () => {
      const markets = createMarketsFromNames([]);
      expect(markets).toEqual([]);
    });
  });

  describe('getMarketEntitiesForRegion', () => {
    it('should return Market entities for Region VII', () => {
      const markets = getMarketEntitiesForRegion('Region VII');

      expect(markets).toHaveLength(10);
      expect(markets.every(market => market instanceof Market)).toBe(true);
      expect(markets[0].name).toBe('TABUNOK PUBLIC MARKET');
    });

    it('should return empty array for unknown region', () => {
      const markets = getMarketEntitiesForRegion('Unknown Region');
      expect(markets).toEqual([]);
    });
  });
});

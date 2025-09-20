import {
  API_CONFIG,
  DATABASE_CONFIG,
  COMMODITY_TYPES,
  REGIONS,
  DEFAULT_VALUES,
  ERROR_MESSAGES,
} from '../config/constants';

describe('Constants Configuration', () => {
  describe('API_CONFIG', () => {
    it('should have correct API configuration values', () => {
      expect(API_CONFIG.BANTAY_PRESYO_BASE_URL).toBe('http://www.bantaypresyo.da.gov.ph');
      expect(API_CONFIG.DEFAULT_PORT).toBe(4000);
      expect(API_CONFIG.GRAPHQL_ENDPOINT).toBe('/graphql');
    });

    it('should be readonly', () => {
      expect(() => {
        (API_CONFIG as any).BANTAY_PRESYO_BASE_URL = 'http://invalid.com';
      }).toThrow();
    });
  });

  describe('DATABASE_CONFIG', () => {
    it('should have correct database configuration values', () => {
      expect(DATABASE_CONFIG.COLLECTIONS.PRICE_DATA).toBe('price_data');
      expect(DATABASE_CONFIG.INDEXES.COMMODITY_AND_REGION).toBe('commodity_region_index');
      expect(DATABASE_CONFIG.INDEXES.COMMODITY).toBe('commodity_index');
      expect(DATABASE_CONFIG.INDEXES.REGION).toBe('region_index');
      expect(DATABASE_CONFIG.INDEXES.UPDATED_AT).toBe('updated_at_index');
    });
  });

  describe('COMMODITY_TYPES', () => {
    it('should contain expected commodity types', () => {
      const expectedTypes = [
        'Rice',
        'Corn',
        'Vegetables',
        'Fruits',
        'Meat',
        'Fish',
        'Poultry',
        'Dairy',
      ];

      expect(COMMODITY_TYPES).toEqual(expectedTypes);
      expect(COMMODITY_TYPES).toHaveLength(8);
    });

    it('should be readonly', () => {
      expect(() => {
        (COMMODITY_TYPES as any).push('Invalid');
      }).toThrow();
    });
  });

  describe('REGIONS', () => {
    it('should contain all Philippine regions', () => {
      expect(REGIONS).toContain('Region VII (Central Visayas)');
      expect(REGIONS).toContain('NCR (National Capital Region)');
      expect(REGIONS).toContain('CAR (Cordillera Administrative Region)');
      expect(REGIONS).toContain('BARMM (Bangsamoro Autonomous Region in Muslim Mindanao)');
    });

    it('should have correct number of regions', () => {
      expect(REGIONS).toHaveLength(17);
    });
  });

  describe('DEFAULT_VALUES', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_VALUES.COUNT).toBe(10);
      expect(DEFAULT_VALUES.TIMEOUT_MS).toBe(30000);
      expect(DEFAULT_VALUES.MAX_RETRIES).toBe(3);
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should contain all expected error messages', () => {
      expect(ERROR_MESSAGES.MONGODB_CONNECTION_FAILED).toBe('Failed to connect to MongoDB');
      expect(ERROR_MESSAGES.PRICE_DATA_FETCH_FAILED).toBe('Failed to fetch price data');
      expect(ERROR_MESSAGES.PRICE_DATA_SAVE_FAILED).toBe('Failed to save price data');
      expect(ERROR_MESSAGES.INVALID_REQUEST).toBe('Invalid request parameters');
      expect(ERROR_MESSAGES.EXTERNAL_API_ERROR).toBe('External API error');
      expect(ERROR_MESSAGES.VALIDATION_ERROR).toBe('Validation error');
    });
  });
});

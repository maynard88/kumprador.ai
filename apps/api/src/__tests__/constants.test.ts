import {
  API_CONFIG,
  DATABASE_CONFIG,
  COMMODITY_TYPES,
  COMMODITY_IDS,
  COMMODITY_ID_TO_NAME,
  COMMODITY_NAME_TO_ID,
  COMMODITY_UTILS,
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

    it('should have consistent configuration values', () => {
      expect(API_CONFIG.BANTAY_PRESYO_BASE_URL).toBe('http://www.bantaypresyo.da.gov.ph');
      expect(API_CONFIG.DEFAULT_PORT).toBe(4000);
      expect(API_CONFIG.GRAPHQL_ENDPOINT).toBe('/graphql');
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

    it('should contain all expected commodity types', () => {
      expect(COMMODITY_TYPES).toContain('Rice');
      expect(COMMODITY_TYPES).toContain('Corn');
      expect(COMMODITY_TYPES).toContain('Vegetables');
      expect(COMMODITY_TYPES).toContain('Fruits');
      expect(COMMODITY_TYPES).toContain('Meat');
      expect(COMMODITY_TYPES).toContain('Fish');
      expect(COMMODITY_TYPES).toContain('Poultry');
      expect(COMMODITY_TYPES).toContain('Dairy');
    });
  });

  describe('COMMODITY_IDS', () => {
    it('should contain correct commodity IDs', () => {
      expect(COMMODITY_IDS.RICE).toBe(1);
      expect(COMMODITY_IDS.FISH).toBe(4);
      expect(COMMODITY_IDS.FRUITS).toBe(5);
      expect(COMMODITY_IDS.HIGHLAND_VEGETABLES).toBe(6);
      expect(COMMODITY_IDS.LOWLAND_VEGETABLES).toBe(7);
      expect(COMMODITY_IDS.MEAT).toBe(8);
      expect(COMMODITY_IDS.SPICES).toBe(9);
      expect(COMMODITY_IDS.OTHER_COMMODITIES).toBe(10);
    });

    it('should have consistent ID values', () => {
      expect(COMMODITY_IDS.RICE).toBe(1);
      expect(COMMODITY_IDS.FISH).toBe(4);
      expect(COMMODITY_IDS.FRUITS).toBe(5);
      expect(COMMODITY_IDS.HIGHLAND_VEGETABLES).toBe(6);
      expect(COMMODITY_IDS.LOWLAND_VEGETABLES).toBe(7);
      expect(COMMODITY_IDS.MEAT).toBe(8);
      expect(COMMODITY_IDS.SPICES).toBe(9);
      expect(COMMODITY_IDS.OTHER_COMMODITIES).toBe(10);
    });
  });

  describe('COMMODITY_ID_TO_NAME', () => {
    it('should map IDs to correct names', () => {
      expect(COMMODITY_ID_TO_NAME[1]).toBe('Rice');
      expect(COMMODITY_ID_TO_NAME[4]).toBe('Fish');
      expect(COMMODITY_ID_TO_NAME[5]).toBe('Fruits');
      expect(COMMODITY_ID_TO_NAME[6]).toBe('High Land Vegetables');
      expect(COMMODITY_ID_TO_NAME[7]).toBe('Low Land Vegetables');
      expect(COMMODITY_ID_TO_NAME[8]).toBe('Meat');
      expect(COMMODITY_ID_TO_NAME[9]).toBe('Spices');
      expect(COMMODITY_ID_TO_NAME[10]).toBe('Other commodities');
    });
  });

  describe('COMMODITY_NAME_TO_ID', () => {
    it('should map names to correct IDs', () => {
      expect(COMMODITY_NAME_TO_ID['Rice']).toBe(1);
      expect(COMMODITY_NAME_TO_ID['Fish']).toBe(4);
      expect(COMMODITY_NAME_TO_ID['Fruits']).toBe(5);
      expect(COMMODITY_NAME_TO_ID['High Land Vegetables']).toBe(6);
      expect(COMMODITY_NAME_TO_ID['Low Land Vegetables']).toBe(7);
      expect(COMMODITY_NAME_TO_ID['Meat']).toBe(8);
      expect(COMMODITY_NAME_TO_ID['Spices']).toBe(9);
      expect(COMMODITY_NAME_TO_ID['Other commodities']).toBe(10);
    });
  });

  describe('COMMODITY_UTILS', () => {
    describe('getNameById', () => {
      it('should return correct name for valid ID', () => {
        expect(COMMODITY_UTILS.getNameById(1)).toBe('Rice');
        expect(COMMODITY_UTILS.getNameById(4)).toBe('Fish');
        expect(COMMODITY_UTILS.getNameById(10)).toBe('Other commodities');
      });

      it('should return undefined for invalid ID', () => {
        expect(COMMODITY_UTILS.getNameById(999)).toBeUndefined();
        expect(COMMODITY_UTILS.getNameById(0)).toBeUndefined();
      });
    });

    describe('getIdByName', () => {
      it('should return correct ID for valid name', () => {
        expect(COMMODITY_UTILS.getIdByName('Rice')).toBe(1);
        expect(COMMODITY_UTILS.getIdByName('Fish')).toBe(4);
        expect(COMMODITY_UTILS.getIdByName('Other commodities')).toBe(10);
      });

      it('should return undefined for invalid name', () => {
        expect(COMMODITY_UTILS.getIdByName('Invalid')).toBeUndefined();
        expect(COMMODITY_UTILS.getIdByName('')).toBeUndefined();
      });
    });

    describe('isValidId', () => {
      it('should return true for valid IDs', () => {
        expect(COMMODITY_UTILS.isValidId(4)).toBe(true);
        expect(COMMODITY_UTILS.isValidId(5)).toBe(true);
        expect(COMMODITY_UTILS.isValidId(10)).toBe(true);
      });

      it('should return false for invalid IDs', () => {
        expect(COMMODITY_UTILS.isValidId(999)).toBe(false);
        expect(COMMODITY_UTILS.isValidId(0)).toBe(false);
      });
    });

    describe('isValidName', () => {
      it('should return true for valid names', () => {
        expect(COMMODITY_UTILS.isValidName('Rice')).toBe(true);
        expect(COMMODITY_UTILS.isValidName('Fish')).toBe(true);
        expect(COMMODITY_UTILS.isValidName('Other commodities')).toBe(true);
      });

      it('should return false for invalid names', () => {
        expect(COMMODITY_UTILS.isValidName('Invalid')).toBe(false);
        expect(COMMODITY_UTILS.isValidName('')).toBe(false);
      });
    });

    describe('getAllIds', () => {
      it('should return all commodity IDs', () => {
        const ids = COMMODITY_UTILS.getAllIds();
        expect(ids).toContain(1);
        expect(ids).toContain(4);
        expect(ids).toContain(5);
        expect(ids).toContain(6);
        expect(ids).toContain(7);
        expect(ids).toContain(8);
        expect(ids).toContain(9);
        expect(ids).toContain(10);
        expect(ids).toHaveLength(8);
      });
    });

    describe('getAllNames', () => {
      it('should return all commodity names', () => {
        const names = COMMODITY_UTILS.getAllNames();
        expect(names).toContain('Rice');
        expect(names).toContain('Fish');
        expect(names).toContain('Other commodities');
        expect(names).toHaveLength(8);
      });
    });

    describe('getCommodityInfo', () => {
      it('should return commodity info for valid ID', () => {
        const info = COMMODITY_UTILS.getCommodityInfo(1);
        expect(info).toEqual({ id: 1, name: 'Rice' });
      });

      it('should return undefined for invalid ID', () => {
        expect(COMMODITY_UTILS.getCommodityInfo(999)).toBeUndefined();
      });
    });

    describe('getCommodityInfoByName', () => {
      it('should return commodity info for valid name', () => {
        const info = COMMODITY_UTILS.getCommodityInfoByName('Rice');
        expect(info).toEqual({ id: 1, name: 'Rice' });
      });

      it('should return undefined for invalid name', () => {
        expect(COMMODITY_UTILS.getCommodityInfoByName('Invalid')).toBeUndefined();
      });
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

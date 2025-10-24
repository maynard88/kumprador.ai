import {
  COMMODITY_IDS,
  COMMODITY_ID_TO_NAME,
  COMMODITY_NAME_TO_ID,
  COMMODITY_CATEGORIES,
  COMMODITY_UTILS,
  type CommodityId,
  type CommodityName,
  type CommodityCategory,
} from '../config/commodityConfig';

describe('Commodity Configuration', () => {
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

  describe('COMMODITY_CATEGORIES', () => {
    it('should contain correct category mappings', () => {
      expect(COMMODITY_CATEGORIES.GRAINS).toEqual([1]);
      expect(COMMODITY_CATEGORIES.PROTEIN).toEqual([4, 8]);
      expect(COMMODITY_CATEGORIES.VEGETABLES).toEqual([6, 7]);
      expect(COMMODITY_CATEGORIES.FRUITS).toEqual([5]);
      expect(COMMODITY_CATEGORIES.SEASONINGS).toEqual([9]);
      expect(COMMODITY_CATEGORIES.OTHER).toEqual([10]);
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
        expect(COMMODITY_UTILS.isValidId(1)).toBe(true);
        expect(COMMODITY_UTILS.isValidId(4)).toBe(true);
        expect(COMMODITY_UTILS.isValidId(10)).toBe(true);
      });

      it('should return false for invalid IDs', () => {
        expect(COMMODITY_UTILS.isValidId(999)).toBe(false);
        expect(COMMODITY_UTILS.isValidId(0)).toBe(false);
        expect(COMMODITY_UTILS.isValidId(11)).toBe(false);
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

    describe('getCommoditiesByCategory', () => {
      it('should return correct commodities for each category', () => {
        expect(COMMODITY_UTILS.getCommoditiesByCategory('GRAINS')).toEqual([1]);
        expect(COMMODITY_UTILS.getCommoditiesByCategory('PROTEIN')).toEqual([4, 8]);
        expect(COMMODITY_UTILS.getCommoditiesByCategory('VEGETABLES')).toEqual([6, 7]);
        expect(COMMODITY_UTILS.getCommoditiesByCategory('FRUITS')).toEqual([5]);
        expect(COMMODITY_UTILS.getCommoditiesByCategory('SEASONINGS')).toEqual([9]);
        expect(COMMODITY_UTILS.getCommoditiesByCategory('OTHER')).toEqual([10]);
      });
    });

    describe('getCategoryForCommodity', () => {
      it('should return correct category for commodity ID', () => {
        expect(COMMODITY_UTILS.getCategoryForCommodity(1)).toBe('GRAINS');
        expect(COMMODITY_UTILS.getCategoryForCommodity(4)).toBe('PROTEIN');
        expect(COMMODITY_UTILS.getCategoryForCommodity(6)).toBe('VEGETABLES');
        expect(COMMODITY_UTILS.getCategoryForCommodity(5)).toBe('FRUITS');
        expect(COMMODITY_UTILS.getCategoryForCommodity(9)).toBe('SEASONINGS');
        expect(COMMODITY_UTILS.getCategoryForCommodity(10)).toBe('OTHER');
      });

      it('should return undefined for invalid commodity ID', () => {
        expect(COMMODITY_UTILS.getCategoryForCommodity(999)).toBeUndefined();
      });
    });

    describe('getAllCategories', () => {
      it('should return all categories', () => {
        const categories = COMMODITY_UTILS.getAllCategories();
        expect(categories).toContain('GRAINS');
        expect(categories).toContain('PROTEIN');
        expect(categories).toContain('VEGETABLES');
        expect(categories).toContain('FRUITS');
        expect(categories).toContain('SEASONINGS');
        expect(categories).toContain('OTHER');
        expect(categories).toHaveLength(6);
      });
    });
  });
});





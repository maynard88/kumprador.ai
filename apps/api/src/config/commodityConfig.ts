/**
 * Commodity Configuration
 * Contains all commodity-related constants and utilities for the Bantay Presyo API
 */

// Commodity ID Mapping (Bantay Presyo API IDs)
export const COMMODITY_IDS = {
  RICE: 1,
  FISH: 4,
  FRUITS: 5,
  HIGHLAND_VEGETABLES: 6,
  LOWLAND_VEGETABLES: 7,
  MEAT: 8,
  SPICES: 9,
  OTHER_COMMODITIES: 10,
} as const;

// Commodity ID to Name Mapping
export const COMMODITY_ID_TO_NAME = {
  [COMMODITY_IDS.RICE]: 'Rice',
  [COMMODITY_IDS.FISH]: 'Fish',
  [COMMODITY_IDS.FRUITS]: 'Fruits',
  [COMMODITY_IDS.HIGHLAND_VEGETABLES]: 'High Land Vegetables',
  [COMMODITY_IDS.LOWLAND_VEGETABLES]: 'Low Land Vegetables',
  [COMMODITY_IDS.MEAT]: 'Meat',
  [COMMODITY_IDS.SPICES]: 'Spices',
  [COMMODITY_IDS.OTHER_COMMODITIES]: 'Other commodities',
} as const;

// Commodity Name to ID Mapping
export const COMMODITY_NAME_TO_ID = {
  'Rice': COMMODITY_IDS.RICE,
  'Fish': COMMODITY_IDS.FISH,
  'Fruits': COMMODITY_IDS.FRUITS,
  'High Land Vegetables': COMMODITY_IDS.HIGHLAND_VEGETABLES,
  'Low Land Vegetables': COMMODITY_IDS.LOWLAND_VEGETABLES,
  'Meat': COMMODITY_IDS.MEAT,
  'Spices': COMMODITY_IDS.SPICES,
  'Other commodities': COMMODITY_IDS.OTHER_COMMODITIES,
} as const;

// Commodity Categories
export const COMMODITY_CATEGORIES = {
  GRAINS: [COMMODITY_IDS.RICE],
  PROTEIN: [COMMODITY_IDS.FISH, COMMODITY_IDS.MEAT],
  VEGETABLES: [COMMODITY_IDS.HIGHLAND_VEGETABLES, COMMODITY_IDS.LOWLAND_VEGETABLES],
  FRUITS: [COMMODITY_IDS.FRUITS],
  SEASONINGS: [COMMODITY_IDS.SPICES],
  OTHER: [COMMODITY_IDS.OTHER_COMMODITIES],
} as const;

// Utility Functions for Commodity Management
export const COMMODITY_UTILS = {
  /**
   * Get commodity name by ID
   */
  getNameById: (id: number): string | undefined => {
    return COMMODITY_ID_TO_NAME[id as keyof typeof COMMODITY_ID_TO_NAME];
  },

  /**
   * Get commodity ID by name
   */
  getIdByName: (name: string): number | undefined => {
    return COMMODITY_NAME_TO_ID[name as keyof typeof COMMODITY_NAME_TO_ID];
  },

  /**
   * Check if commodity ID is valid
   */
  isValidId: (id: number): boolean => {
    return id in COMMODITY_ID_TO_NAME;
  },

  /**
   * Check if commodity name is valid
   */
  isValidName: (name: string): boolean => {
    return name in COMMODITY_NAME_TO_ID;
  },

  /**
   * Get all commodity IDs
   */
  getAllIds: (): number[] => {
    return Object.values(COMMODITY_IDS);
  },

  /**
   * Get all commodity names
   */
  getAllNames: (): string[] => {
    return Object.keys(COMMODITY_NAME_TO_ID);
  },

  /**
   * Get commodity info by ID
   */
  getCommodityInfo: (id: number): { id: number; name: string } | undefined => {
    const name = COMMODITY_UTILS.getNameById(id);
    return name ? { id, name } : undefined;
  },

  /**
   * Get commodity info by name
   */
  getCommodityInfoByName: (name: string): { id: number; name: string } | undefined => {
    const id = COMMODITY_UTILS.getIdByName(name);
    return id ? { id, name } : undefined;
  },

  /**
   * Get commodities by category
   */
  getCommoditiesByCategory: (category: keyof typeof COMMODITY_CATEGORIES): number[] => {
    return COMMODITY_CATEGORIES[category];
  },

  /**
   * Get category for a commodity ID
   */
  getCategoryForCommodity: (id: number): string | undefined => {
    for (const [category, ids] of Object.entries(COMMODITY_CATEGORIES)) {
      if (ids.includes(id)) {
        return category;
      }
    }
    return undefined;
  },

  /**
   * Get all categories
   */
  getAllCategories: (): string[] => {
    return Object.keys(COMMODITY_CATEGORIES);
  },
} as const;

// Type definitions
export type CommodityId = typeof COMMODITY_IDS[keyof typeof COMMODITY_IDS];
export type CommodityName = keyof typeof COMMODITY_NAME_TO_ID;
export type CommodityCategory = keyof typeof COMMODITY_CATEGORIES;
